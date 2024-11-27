// CategorySelection.jsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CategorySelection = ({ onClose }) => {
    const [preferences, setPreferences] = useState([]); // Current user preferences
    const categories = ['Education', 'Transport', 'Housing', 'Other']; // Available categories
    const auth = getAuth();
    const db = getFirestore();

    const initializePreferences = async (uid) => {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("Document does not exist, initializing preferences.");
            await setDoc(docRef, { preferences: [] });
            return [];
        }
        console.log("Document exists:", docSnap.data());
        return docSnap.data().preferences || [];
    };

    useEffect(() => {
        const fetchPreferencesForUser = async (user) => {
            try {
                const userPreferences = await initializePreferences(user.uid);
                console.log('Fetched preferences:', userPreferences); // Debug log
                setPreferences(userPreferences || []); // Ensure preferences are set
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchPreferencesForUser(user);
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const handleCategoryPress = async (category) => {
        const user = auth.currentUser;
        if (!user) return;

        let updatedPreferences;

        if (preferences.includes(category)) {
            updatedPreferences = preferences.filter((pref) => pref !== category);
        } else {
            updatedPreferences = [...preferences, category];
        }

        setPreferences(updatedPreferences);

        try {
            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, { preferences: updatedPreferences }, { merge: true });
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    return (
        <View style={styles.modalContainer}>
            {/* Header with Close Text */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.headingText}>Preferences</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.headerText}>Select the type of information:</Text>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.button,
                            preferences.includes(category) ? styles.buttonSelected : null, // Highlight selected categories
                        ]}
                        onPress={() => handleCategoryPress(category)}
                    >
                        <Text style={styles.buttonText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    headingText: {
        fontSize: 24,
        marginLeft: 10,
    },
    container: {
        alignItems: 'center',
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonSelected: {
        backgroundColor: '#34C759', // Highlight color for selected categories
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default CategorySelection;
