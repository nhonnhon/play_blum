"use client";

import { useState } from 'react';

export default function Home() {
  const [textValue, setTextValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]); // New state for logs

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    playAndClaimGame(parseInt(inputValue));
  };

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, message]); // Append new log messages to state
  };

  const playAndClaimGame = async (playTime: number) => {
    for (let i = 0; i < playTime; i++) {
      addLog('----------------')
      addLog(`Game ${i + 1}. Start Play game...`);
      const _points = Math.floor(Math.random() * (120 - 80 + 1)) + 110;

      const headers: HeadersInit =  {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': textValue,
        'origin': 'https://telegram.blum.codes',
        'priority': 'u=1, i',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128", "Microsoft Edge WebView2";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
      };

      delete headers["content-type"];
      const response = await fetch('https://game-domain.blum.codes/api/v1/game/play', {
        method: 'POST',
        headers: headers,
      });

      const responseData = await response.json();
      const gameId = responseData.gameId;
      addLog(`GameId: ${gameId}`);

      const _sleep = Math.floor(Math.random() * 11 + 50) * 1000;
      addLog(`Sleep: ${_sleep / 1000}s`);
      await sleep(_sleep);

      headers["content-type"] = 'application/json';
      delete headers["content-length"];
      const claim = await fetch('https://game-domain.blum.codes/api/v1/game/claim', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          'gameId': gameId,
          'points': _points,
        }),
      });

      const claimText = await claim.text();
      addLog(`Play status: ${claimText}. Points: ${_points}`);

      const _sleep2 = Math.floor(Math.random() * 6 + 15) * 1000;
      addLog(`Sleep: ${_sleep2 / 1000}s`);
      await sleep(_sleep2);
      addLog('----------------')
    }
    addLog(" -- [ DONE ALL ] --");
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="container mx-auto">
      <div className='mx-auto max-w-2xl'>
        <h1 className='my-3 text-3xl font-extrabold tracking-tight text-slate-900'>Play Blum</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="textarea" className='block text-sm font-medium leading-6 text-gray-900'>Token</label>
            <textarea
              id="textarea"
              value={textValue}
              onChange={handleTextChange}
              rows={4}
              className='resize-none block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder="Enter some text..."
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="input" className='block text-sm font-medium leading-6 text-gray-900'>Play times</label>
            <input
              id="input"
              type="number"
              value={inputValue}
              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              onChange={handleInputChange}
              placeholder="Enter a value..."
            />
          </div>
          <button disabled={!textValue || !inputValue} type="submit" className='disabled:opacity-25 pointer-events-auto rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500'>Submit</button>
        </form>

        {/* Display logs */}
        <div className='mt-5'>
          <h2 className='text-xl font-bold'>Running:</h2>
          <div className='mt-2 p-4 bg-gray-100 border rounded-lg'>
            {logs.length === 0 ? (
              <p className='text-gray-500'>No logs yet...</p>
            ) : (
              <ul className='list-none'>
                {logs.map((log, index) => (
                  <li key={index} className='text-sm text-gray-800'>{log}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
