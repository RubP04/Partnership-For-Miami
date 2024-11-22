import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import styles from '.styles.css';
import { useNavigate } from 'react-router-dom';

const PolicyList =() => {
    //Pretend data until replaced with data
const [policies, setPolicies] = useState([]);
const navigate = useNavigate();
//fetching data 
useEffect( () => {

    //Uncomment when connecting to API

    // const fetchPolicies = async () => {
    //   try{
    //     const response = await fetch('https://api.example'); //change once we have our api address
    //     const data = await response.json();
    //     setPolicies(data);
    //     } catch (error) {
    //         console.error('Error fetching policies:', error);
    //     }
    // };
    // fetchPolicies();

    //sample data 
    const samplePolicies = [
        { id: '1', title: 'Affordable Housing Act'},
        { id: '2', title: 'School Safety Regulation'},
        { id: '3', title: 'Transportation Modernization'},
    ];
    setPolicies(samplePolicies);
}, []);

return (
    <div className= "policy-list-container" >
        <h1 className="title">Select a Policy</h1>
    {policies.length > 0 ? (
      policies.map((policy) => (
        <button
        key={policy.id}
        onClick={() => navigate(`policy-details/${policy.id}`)}
        className="policy-button"
        >

         {policy.name}
        </button>
       ))
    ) : (
        <p>Loading policies...</p>
    )}
    </div>
  );
}; 
