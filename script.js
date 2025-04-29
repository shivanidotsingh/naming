// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the input elements
    const qualitiesInput = document.getElementById('qualities');
    const valuesInput = document.getElementById('values');
    const functionInput = document.getElementById('function');
    const impactInput = document.getElementById('impact');

    // Get references to the results sections
    const wordsmithResultsDiv = document.getElementById('wordsmith-results');
    const metaphorResultsDiv = document.getElementById('metaphor-results');

    // Get reference to the generate button
    const generateButton = document.getElementById('generate-names-btn');

    // Add an event listener to the button
    generateButton.addEventListener('click', () => {
        // --- 1. Collect Inputs ---
        const qualities = qualitiesInput.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        const values = valuesInput.value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        const functionDesc = functionInput.value.trim();
        const impactDesc = impactInput.value.trim();

        // Combine all input words for wordsmithing
        const allWords = [
            ...qualities,
            ...values,
            ...functionDesc.split(' ').map(item => item.trim()).filter(item => item.length > 0),
            ...impactDesc.split(' ').map(item => item.trim()).filter(item => item.length > 0)
        ].filter(word => word.length > 1); // Filter out very short words

        // Store all inputs for metaphorizing
        const metaphorInputs = {
            qualities: qualities,
            values: values
            // Function and Impact are typically less used for *metaphorical* naming,
            // but you could include them if your data.js supports it.
        };


        console.log("All words for wordsmithing:", allWords); // Log inputs for debugging
        console.log("Inputs for metaphorizing:", metaphorInputs); // Log inputs for debugging

        // Clear previous results
        wordsmithResultsDiv.innerHTML = '';
        metaphorResultsDiv.innerHTML = '';

        // --- 2. Perform Synthesis ---

        // Call synthesis functions
        // Filter/Rank based on syllable count and novelty *within* the functions
        const wordsmithSuggestions = performWordsmithing(allWords);
        // Pass the data for metaphorizing (assuming data.js is loaded)
        const metaphorSuggestions = performMetaphorizing(metaphorInputs, typeof namingData !== 'undefined' ? namingData : null);


        // --- 3. Display Results (Limited to Top 3) ---

        displayResults(wordsmithResultsDiv, wordsmithSuggestions, 'Wordsmith', 3); // Display top 3
        displayResults(metaphorResultsDiv, metaphorSuggestions, 'Metaphor', 3);   // Display top 3
    });

    // --- Synthesis Functions ---

    /**
     * Generates wordsmith suggestions by combining parts of input words.
     * Also filters by syllable count and performs a basic novelty check.
     * @param {string[]} words - Array of all relevant input words.
     * @returns {string[]} - Array of suggested names, filtered and potentially ranked.
     */
    function performWordsmithing(words) {
        const generatedNames = new Set(); // Use a Set to automatically handle duplicates

        // Simple strategy: Combine prefixes and suffixes
        const prefixLengths = [2, 3, 4]; // Try prefixes of these lengths
        const suffixLengths = [2, 3, 4]; // Try suffixes of these lengths

        for (let i = 0; i < words.length; i++) {
            for (let j = 0; j < words.length; j++) {
                if (i === j) continue; // Don't combine a word with itself

                const wordA = words[i];
                const wordB = words[j];

                for (const pLen of prefixLengths) {
                    if (wordA.length >= pLen) {
                         const prefix = wordA.substring(0, pLen);
                         // Try combining prefix with suffixes of wordB
                         for (const sLen of suffixLengths) {
                             if (wordB.length >= sLen) {
                                 const suffix = wordB.substring(wordB.length - sLen);
                                 const newName = prefix + suffix;

                                 // Basic checks: prevent identical words or very short/long results from simple combinations
                                 if (newName.toLowerCase() !== wordA.toLowerCase() &&
                                     newName.toLowerCase() !== wordB.toLowerCase() &&
                                     newName.length > 3 && newName.length < 12 // Prevent overly short/long results
                                    ) {
                                     generatedNames.add(newName);
                                 }
                             }
                         }
                    }
                }
                // Optional: Add full word combinations
                 const combinedFull = wordA + wordB;
                 if (combinedFull.length > 3 && combinedFull.length < 15) {
                      generatedNames.add(combinedFull);
                 }
            }
        }

        // Convert Set to Array
        let suggestions = Array.from(generatedNames);

        // --- Filtering ---
        // Filter by syllable count (<= 4)
        suggestions = suggestions.filter(name => countSyllables(name) <= 4);

        // Filter/Rank by novelty (basic implementation)
        // For a real application, you'd need a better dictionary/check here.
        // Here, we just filter out very common short words.
         suggestions = suggestions.filter(name => isNovel(name));


        // TODO: Add more sophisticated ranking if possible (e.g., phonetic score, etc.)

        return suggestions; // Return all valid suggestions after filtering
    }

    /**
     * Generates metaphor suggestions using a knowledge base.
     * Also filters by syllable count and performs a basic novelty check.
     * @param {object} inputs - Object containing qualities and values arrays.
     * @param {object | null} data - The namingData object from data.js, or null if not loaded.
     * @returns {string[]} - Array of suggested names, filtered and potentially ranked.
     */
    function performMetaphorizing(inputs, data) {
        const suggestions = new Set(); // Use Set for uniqueness

        if (!data || typeof data.qualities === 'undefined' || typeof data.values === 'undefined') {
            console.warn("Metaphorizing data (data.js) not loaded correctly.");
            // Return dummy data or empty array if data isn't available
            return ["Phoenix", "Oak", "Nexus", "Aegis"].filter(name => countSyllables(name) <= 4 && isNovel(name)); // Filter dummy data
        }

        // Collect potential symbolic names based on inputs
        inputs.qualities.forEach(quality => {
            const symbols = data.qualities[quality.toLowerCase()]; // Assuming lowercase keys in data.js
            if (symbols) {
                symbols.forEach(symbol => suggestions.add(symbol));
            }
        });

        inputs.values.forEach(value => {
             const symbols = data.values[value.toLowerCase()]; // Assuming lowercase keys in data.js
             if (symbols) {
                 symbols.forEach(symbol => suggestions.add(symbol));
             }
         });

        let resultNames = Array.from(suggestions);

        // --- Filtering ---
        // Filter by syllable count (<= 4)
        resultNames = resultNames.filter(name => countSyllables(name) <= 4);

        // Filter/Rank by novelty (basic implementation)
        // For a real application, you'd check against lists of common symbols/names.
        resultNames = resultNames.filter(name => isNovel(name));


         // TODO: Add more sophisticated ranking if possible (e.g., favor less common symbols from the data)

        return resultNames; // Return all valid suggestions after filtering
    }

    // --- Helper function to display results ---

    /**
     * Displays suggestions in a specific div, limited by count.
     * @param {HTMLElement} resultsDiv - The div element to display results in.
     * @param {string[]} suggestions - Array of name strings to display.
     * @param {string} type - Type of suggestions (for logging/displaying).
     * @param {number} limit - The maximum number of suggestions to display.
     */
    function displayResults(resultsDiv, suggestions, type, limit) {
        if (!suggestions || suggestions.length === 0) {
            resultsDiv.innerHTML = `<p>No ${type} suggestions found based on inputs (after filtering).</p>`;
            console.log(`No ${type} suggestions found.`);
            return;
        }

        console.log(`${type} suggestions found (before limit):`, suggestions);

        // Take only the top N suggestions
        const limitedSuggestions = suggestions.slice(0, limit);

        // Append each suggestion to the results div
        limitedSuggestions.forEach(name => {
            const nameElement = document.createElement('div');
            nameElement.textContent = name;
            resultsDiv.appendChild(nameElement);
        });

         if (suggestions.length > limit) {
              // Optional: Add a note if more suggestions were available
              const moreNote = document.createElement('div');
              moreNote.textContent = `...${suggestions.length - limit} more found (view console)`; // Or add a "show more" button
              moreNote.style.fontSize = '0.9em';
              moreNote.style.marginTop = '10px';
              resultsDiv.appendChild(moreNote);
         }

    }

    // --- Helper functions for filtering ---

    /**
     * Basic Syllable Counting Algorithm.
     * This is a heuristic and may not be perfect for all words,
     * especially made-up words or complex English words.
     * @param {string} word - The word to count syllables for.
     * @returns {number} - The estimated syllable count.
     */
    function countSyllables(word) {
        if (!word) return 0;

        word = word.toLowerCase();

        // Remove common non-syllable-creating endings
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        // Handle specific endings
        word = word.replace(/^y/, ''); // Remove leading 'y'

        let count = (word.match(/[aeiouy]{1,2}/g) || []).length;

        // Adjust for single vowel words
        if (count === 0) {
            count = 1;
        }
        // Adjust for silent e (handled above) or double vowels like "io" in "action" - the regex helps
        // Can add more complex rules if needed

        // Handle words like "create", "reliable" where 'ia' or 'ea' form separate syllables
        // This basic regex might handle some, but not all.
        // More advanced: Look for patterns like vowel-consonant-vowel or specific suffixes.

        // Final check: minimum 1 syllable
        return Math.max(1, count);
    }

    /**
     * Basic Novelty Check.
     * This is a very simple placeholder.
     * A real implementation needs a dictionary lookup or comparison against existing names.
     * @param {string} name - The name to check.
     * @returns {boolean} - True if considered potentially novel, false if considered common.
     */
    function isNovel(name) {
        if (!name) return false;

        const commonShortWords = new Set(['the', 'a', 'an', 'is', 'and', 'or', 'in', 'on', 'at', 'for', 'with', 'by', 'of', 'to', 'from']);
        const lowerName = name.toLowerCase();

        // Rule 1: Is it a very common short word?
        if (commonShortWords.has(lowerName)) {
            console.log(`- "${name}" flagged as non-novel (common short word).`);
            return false;
        }

        // Rule 2: Add more rules here later!
        // - Check against a larger dictionary
        // - Check against lists of common business name patterns
        // - Check against lists of existing names (harder)

        // Placeholder Rule 3: If it's reasonably long and not a common short word, assume novel for now.
        if (name.length > 3) {
             // console.log(`- "${name}" passed basic novelty check (length > 3).`);
             return true;
        }

        // If it's 3 chars or less and not explicitly in commonShortWords, it's still iffy
        console.log(`- "${name}" flagged as potentially non-novel (very short and not checked against dictionary).`);
        return false;
    }

});
