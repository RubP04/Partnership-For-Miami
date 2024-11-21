import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const Scraper = () => {
    const [scrapedData, setScrapedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalEntries, setTotalEntries] = useState(0);
    const [pageLoadingStates, setPageLoadingStates] = useState({});
    const BATCH_SIZE = 8;
    const PRELOAD_PAGES = 2;

    const fetchData = async (page) => {
        if (scrapedData[page] || pageLoadingStates[page]) return null;

        try {
            setPageLoadingStates(prev => ({ ...prev, [page]: true }));
            console.log(`Fetching page ${page}`);
            
            const response = await fetch(`http://localhost:5000/api/scrape?page=${page}&batch_size=${BATCH_SIZE}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Scraping failed');
            }
            
            return data;
        } catch (err) {
            console.error(`Error fetching page ${page}:`, err);
            throw err;
        } finally {
            setPageLoadingStates(prev => ({ ...prev, [page]: false }));
        }
    };

    const preloadPages = useCallback(async () => {
        const pagesToLoad = [];
        for (let i = 1; i <= PRELOAD_PAGES; i++) {
            const pageToLoad = currentPage + i;
            if (!scrapedData[pageToLoad] && hasMore) {
                pagesToLoad.push(pageToLoad);
            }
        }

        await Promise.all(
            pagesToLoad.map(async (page) => {
                try {
                    const data = await fetchData(page);
                    if (data) {
                        setScrapedData(prev => ({
                            ...prev,
                            [page]: data.entries
                        }));
                        setHasMore(data.hasMore);
                        setTotalEntries(data.total);
                    }
                } catch (err) {
                    console.error(`Failed to preload page ${page}:`, err);
                }
            })
        );
    }, [currentPage, hasMore, scrapedData]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await fetchData(0);
                if (data) {
                    setScrapedData({ 0: data.entries });
                    setTotalEntries(data.total);
                    setHasMore(data.hasMore);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (!loading && hasMore) {
            preloadPages();
        }
    }, [currentPage, loading, hasMore, preloadPages]);

    const handleNextPage = async () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        if (!scrapedData[nextPage]) {
            try {
                const data = await fetchData(nextPage);
                if (data) {
                    setScrapedData(prev => ({
                        ...prev,
                        [nextPage]: data.entries
                    }));
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Fetching Legislative Entries...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => window.location.reload()}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentPageData = scrapedData[currentPage] || [];
    const isCurrentPageLoading = pageLoadingStates[currentPage];

    return (
        <View style={styles.container}>
            {isCurrentPageLoading ? (
                <View style={styles.pageLoadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading Page {currentPage + 1}...</Text>
                </View>
            ) : (
                <ScrollView style={styles.dataContainer}>
                    <Text style={styles.heading}>
                        Legislative Entries ({currentPage * BATCH_SIZE + 1}-
                        {Math.min((currentPage + 1) * BATCH_SIZE, totalEntries)} of {totalEntries})
                    </Text>
                    {currentPageData.map((entry, index) => (
                        <View key={index} style={styles.entry}>
                            <View style={styles.entryContent}>
                                <View style={styles.entryText}>
                                    <Text style={styles.fileNumber}>File Number: {entry[0]}</Text>
                                    <Text style={styles.fileName}>Name: {entry[1]}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.moreInfoButton}
                                    onPress={() => console.log('More info clicked for:', entry[0])}
                                >
                                    <Text style={styles.moreInfoButtonText}>More Info</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
            
            <View style={styles.paginationContainer}>
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
                    onPress={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <Text style={styles.pageText}>Page {currentPage + 1}</Text>
                
                <TouchableOpacity 
                    style={[styles.pageButton, !hasMore && styles.pageButtonDisabled]}
                    onPress={handleNextPage}
                    disabled={!hasMore}
                >
                    <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
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
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
    pageText: {
        fontSize: 14,
        color: '#666',
    },
    pageLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Scraper;
