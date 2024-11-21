import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const Scraper = () => {
    const [scrapedData, setScrapedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            console.log('Starting scrape request...');
            const response = await fetch('http://localhost:5000/api/scrape');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Scraping failed');
            }
            
            console.log('Received data:', data);
            
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No legislative entries found');
            }
            
            setScrapedData(data);
        } catch (err) {
            console.error('Error during scraping:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Fetching Legislative Entries...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={fetchData}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.dataContainer}>
                    <Text style={styles.heading}>Legislative Entries:</Text>
                    {scrapedData.map((entry, index) => (
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
});

export default Scraper;
