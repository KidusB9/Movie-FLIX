const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

async function fetchUniversitiesByCountry(country) {
    try {
        const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data for country ${country}:`, error);
        return [];
    }
}

router.get('/api/v1/universities', async (req, res) => {
    try {
        const { country } = req.query;
        let countries = [];

        if (typeof country === 'string') {
            countries = country.split(',');
        }

        const promises = countries.map(countryName => fetchUniversitiesByCountry(countryName.trim().replace(/_/g, ' ')));
        const results = await Promise.all(promises);
        let universities = [].concat(...results);

        // Remove duplicates based on university name
        universities = universities.filter((university, index, self) =>
            index === self.findIndex((u) => (u.name === university.name))
        );

        res.json(universities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


// import express from 'express';
// import fetch from 'node-fetch';

// const router = express.Router();

// // Helper function to fetch universities by country
// const fetchUniversitiesByCountry = async (country: string): Promise<any[]> => {
//   try {
//     const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch data');
//     }
//     const data = await response.json();
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error(`Error fetching data for country ${country}:`, error);
//     return [];
//   }
// };

// // Route to get universities by multiple countries
// router.get('/api/v1/universities', async (req, res) => {
//   try {
//     const { country } = req.query;
//     let countries: string[] = [];

//     if (typeof country === 'string') {
//       countries = country.split(',');
//     }

//     const promises = countries.map(countryName => fetchUniversitiesByCountry(countryName.trim().replace(/_/g, ' ')));
//     const results = await Promise.all(promises);
//     const universities = [].concat(...results);

//     // Remove duplicates
//     const uniqueUniversities = Array.from(new Map(universities.map(university => [university.name, university])).values());

//     res.json(uniqueUniversities);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;
