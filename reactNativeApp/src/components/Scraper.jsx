// Scraper.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import InfoModal from './InfoModal';
import CategorySelection from './CategorySelection';
import { getAuth, signOut } from 'firebase/auth';

const Scraper = ({ navigation }) => {
    const [originalEntries, setOriginalEntries] = useState([]);
    const [allEntries, setAllEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [pageInput, setPageInput] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const BATCH_SIZE = 8;

    const navigate = useNavigate();
    const auth = getAuth();


    // New state variables
    const [sidePanelVisible, setSidePanelVisible] = useState(false);
    const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);

    useEffect(() => {
        // Update page input when currentPage changes
        setPageInput((currentPage + 1).toString());
    }, [currentPage]);

    const fetchAllEntries = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/entries?all=true');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch entries');
            }

            setOriginalEntries(data.entries); // Cache data on first fetch
            setAllEntries(data.entries); // Populate visible entries
        } catch (err) {
            setError(err.message);
            console.error('Error fetching entries:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchResults = async (query) => {
        try {
            setLoading(true);
            const lowerCaseQuery = query.trim().toUpperCase();
            const response = await fetch(
                `http://localhost:5000/api/search?query=${encodeURIComponent(lowerCaseQuery)}&page=${currentPage}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch search results');
            }

            setAllEntries(data.entries);
            setIsSearchMode(true);
        } catch (err) {
            setError(err.message);
            console.error('Error searching entries:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAllEntries();
    }, []);

    const handlePageInputChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setPageInput(numericValue);
    };

    const handlePageSubmit = () => {
        const pageNum = parseInt(pageInput, 10) - 1; // Convert to 0-based index
        const maxPage = Math.ceil(allEntries.length / BATCH_SIZE) - 1;

        if (pageNum >= 0 && pageNum <= maxPage) {
            setCurrentPage(pageNum);
        } else {
            setPageInput((currentPage + 1).toString());
        }
    };

    const handleSearch = () => {
        const query = searchQuery.trim().toLowerCase();
        if (query) {
            setCurrentPage(0);
            fetchSearchResults(query);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(0);
        setAllEntries(originalEntries); // Restore cached data
        setIsSearchMode(false);
    };

    const getCurrentPageEntries = () => {
        const start = currentPage * BATCH_SIZE;
        return allEntries.slice(start, start + BATCH_SIZE);
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * BATCH_SIZE < allEntries.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleMoreInfo = (fileNumber) => {
        setSelectedFile(fileNumber);
        setModalVisible(true);
    };

    const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate('/login'); // Navigate to the login page
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading entries...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchAllEntries}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentEntries = getCurrentPageEntries();
    const hasMore = (currentPage + 1) * BATCH_SIZE < allEntries.length;

    return (
        <View style={styles.container}>
            {/* Header with Menu Button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton} onPress={() => setSidePanelVisible(true)}>
                    <Text style={styles.menuButtonText}>Menu</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by file number or title"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                {isSearchMode && (
                    <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                        <Text style={styles.clearSearchButtonText}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Entries List */}
            <ScrollView style={styles.dataContainer}>
                <Text style={styles.heading}>
                    {isSearchMode ? 'Search Results' : 'Legislative Entries'} (
                    {currentPage * BATCH_SIZE + 1}-
                    {Math.min((currentPage + 1) * BATCH_SIZE, allEntries.length)} of {allEntries.length})
                </Text>
                {currentEntries.map((entry, index) => (
                    <View key={index} style={styles.entry}>
                        <View style={styles.entryContent}>
                            <View style={styles.entryText}>
                                <Text style={styles.fileNumber}>File Number: {entry[0]}</Text>
                                <Text style={styles.fileName}>Name: {entry[1]}</Text>
                            </View>
                            <TouchableOpacity style={styles.moreInfoButton} onPress={() => handleMoreInfo(entry[0])}>
                                <Text style={styles.moreInfoButtonText}>More Info</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination */}
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
                    onPress={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>

                <View style={styles.pageInputContainer}>
                    <Text style={styles.pageText}>Page </Text>
                    <TextInput
                        style={styles.pageInput}
                        value={pageInput}
                        onChangeText={handlePageInputChange}
                        onSubmitEditing={handlePageSubmit}
                        onBlur={handlePageSubmit}
                        keyboardType="number-pad"
                        maxLength={4}
                    />
                    <Text style={styles.pageText}> of {Math.ceil(allEntries.length / BATCH_SIZE)}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.pageButton, !hasMore && styles.pageButtonDisabled]}
                    onPress={handleNextPage}
                    disabled={!hasMore}
                >
                    <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Info Modal */}
            <InfoModal visible={modalVisible} onClose={() => setModalVisible(false)} fileNumber={selectedFile} />

            {/* Side Panel Modal */}
            <Modal
                visible={sidePanelVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSidePanelVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setSidePanelVisible(false)}
                    activeOpacity={1}
                />
                <View style={styles.sidePanel}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSidePanelVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sidePanelButton}
                        onPress={() => {
                            setSidePanelVisible(false);
                            setPreferencesModalVisible(true);
                        }}
                    >
                        <Text style={styles.sidePanelButtonText}>Preferences</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sidePanelButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.sidePanelButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Preferences Modal */}
            <Modal
                visible={preferencesModalVisible}
                animationType="slide"
                onRequestClose={() => setPreferencesModalVisible(false)}
            >
                <CategorySelection onClose={() => setPreferencesModalVisible(false)} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    dataContainer: {
        flex: 1,
    },
    entry: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    entryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    entryText: {
        flex: 1,
        marginRight: 10,
    },
    fileNumber: {
        fontWeight: '600',
    },
    fileName: {
        marginTop: 5,
    },
    moreInfoButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    moreInfoButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    pageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: 50,
        textAlign: 'center',
        marginHorizontal: 5,
        color: '#333',
    },
    pageText: {
        fontSize: 14,
        color: '#666',
    },
    pageButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    pageButtonDisabled: {
        backgroundColor: '#ccc',
    },
    pageButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        backgroundColor: 'white',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    clearSearchButton: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 5,
    },
    clearSearchButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'flex-start',
    },
    menuButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    sidePanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '70%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
        elevation: 5,
    },
    sidePanelButton: {
        paddingVertical: 15,
    },
    sidePanelButtonText: {
        fontSize: 18,
        color: '#007AFF',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default Scraper;
