import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Scraper = () => {
    const [scrapedData, setScrapedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        
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

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleScrape}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Scraping...' : 'Start Scraping'}
                </Text>
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}
            
            {scrapedData && (
                <ScrollView style={styles.dataContainer}>
                    <Text style={styles.heading}>Legislative Entries:</Text>
                    {scrapedData.map((entry, index) => (
                        <View key={index} style={styles.entry}>
                            <Text style={styles.fileNumber}>File Number: {entry[0]}</Text>
                            <Text style={styles.fileName}>Name: {entry[1]}</Text>
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
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    dataContainer: {
        marginTop: 20,
        maxHeight: 400,
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
    fileNumber: {
        fontWeight: '600',
    },
    fileName: {
        marginTop: 5,
    },
});

export default Scraper;
