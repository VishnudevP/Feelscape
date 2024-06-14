import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import '../styles/style.css';

const Feelscape = () => {
  const [inputText, setInputText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);
  const [generatedQuote, setGeneratedQuote] = useState('');
  const [quoteFetched, setQuoteFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const YOUR_COHERE_API_KEY = 'LK7C9UxxgUM9emaAyqNYgr5erRnuso3iV62xLcNV';

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://api.cohere.com/v1/classify',
        { text: inputText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${YOUR_COHERE_API_KEY}`,
          },
        }
      );

      setSentimentResult(response.data);
      setGeneratedQuote('');
      setQuoteFetched(false);
    } catch (error) {
      console.error('Error analyzing sentiment:', error.response);
      setError(`Failed to analyze sentiment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
    setLoading(true);
    setError('');

    try {
      if (sentimentResult && sentimentResult.sentiment) {
        const emotion = sentimentResult.sentiment;
        const response = await axios.post(
          'https://api.cohere.com/v1/quote',
          { emotion: emotion },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${YOUR_COHERE_API_KEY}`,
            },
          }
        );

        setGeneratedQuote(response.data.quote);
        setQuoteFetched(true);
      } else {
        setGeneratedQuote('Please analyze text first.');
      }
    } catch (error) {
      console.error('Error generating quote:', error.response);
      setError(`Failed to generate quote: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feelscape-container">
      <h1 className="feelscape-header">Feelscape</h1>
      <p className="feelscape-subheader">Share your thoughts or feelings</p>
      <div className="feelscape-form">
        <textarea
          className="feelscape-textfield"
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type here..."
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || inputText.trim() === ''}
          className="feelscape-button"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze'}
        </button>
        <button
          onClick={handleGenerateQuote}
          disabled={!sentimentResult || loading}
          className="feelscape-button"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Daily Quote'}
        </button>
      </div>
      <div className="feelscape-result-container">
        {error && <p className="feelscape-error">{error}</p>}
        {sentimentResult && (
          <div>
            <h3>Sentiment Analysis:</h3>
            <p>You seem {sentimentResult.sentiment || 'neutral'}.</p>
          </div>
        )}
        {quoteFetched && (
          <div>
            <h3>Daily Quote:</h3>
            <p>{generatedQuote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feelscape;
