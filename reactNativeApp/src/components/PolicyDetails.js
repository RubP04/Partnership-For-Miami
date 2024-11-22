import React, {useEffect, useState } from 'react';
import {ueParams, useParams } from 'react-router-dom';

const PolicyDetails = () => {
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);

    //fetching the policy details dynamically 

    useEffect(() => {
        const fetchPoliciesDetails = async () => {
            try {
                const response = await fetch(`https://api.example.com/government-policies-now/${id}`);
            }
        }
    }
}