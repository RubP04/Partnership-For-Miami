import React, {useEffect, useState } from 'react';
import {ueParams, useParams } from 'react-router-dom';
import '../styles.css';

const PolicyDetails = () => {
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);

    //fetching the policy details dynamically 

    useEffect(() => {

        //uncomment use we have the api address
        // const fetchPoliciesDetails = async () => {
        //     try {
        //         const response = await fetch(`https://api.example.com/government-policies-now/${id}`);
        //         const data = await response.json;
        //         setPolicy(data);
        //     } catch (error) {
        //         console.error('Error not able to fetch details:', error);
        //     }
        //     };

        //     fetchPoliciesDetails();

        

    const examplePolicies = [

        { id: 1, name: 'Affordable Houing Act', details: 'Details about Affordable Housing Act. '},
        { id: 2, name: 'School Safety Regu'}
    ]
    }
}