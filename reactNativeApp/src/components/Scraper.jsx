import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import InfoModal from './InfoModal';

const Scraper = () => {
    const [originalEntries, setOriginalEntries] = useState([]); // Cache for all entries
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
            const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(lowerCaseQuery)}&page=${currentPage}`);
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

            <ScrollView style={styles.dataContainer}>
                <Text style={styles.heading}>
                    {isSearchMode ? 'Search Results' : 'Legislative Entries'} (
                    {currentPage * BATCH_SIZE + 1}-{Math.min((currentPage + 1) * BATCH_SIZE, allEntries.length)} of {allEntries.length})
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

            <InfoModal visible={modalVisible} onClose={() => setModalVisible(false)} fileNumber={selectedFile} />
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    goToPageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    goToPageInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        width: 80,
        marginRight: 5,
        textAlign: 'center',
    },
    goButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
        minWidth: 40,
        alignItems: 'center',
    },
    goButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
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
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        backgroundColor: 'white'
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
});

export default Scraper;