'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PortfolioData {
  totalValue: number
  totalGain: number
  totalPct: number
  totalCash: number
  accounts: {
    [key: string]: {
      totalValue: number
      dailyGain: number
      stockValue: number
      cash: number
      holdings: any[]
    }
  }
  topMovers: {
    gainers: any[]
    losers: any[]
  }
  _timestamp?: string
  _cached?: boolean
  _stealthMode?: boolean
}

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stealthMode, setStealthMode] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  // const [mounted, setMounted] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (percent: number | undefined) => {
    if (percent === undefined || percent === null) return '0.00%'
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const fetchPortfolioData = async (stealth = false) => {
    try {
      setLoading(true)
      setError(null)

      // Try local API first, then cloud, then use mock data
      const endpoints = [
        `http://localhost:3000/api/portfolio${stealth ? '/stealth' : ''}`,
        `https://portfolio-automation-nfkyhgeho-jonny-cangemis-projects.vercel.app/api/portfolio${stealth ? '/stealth' : ''}`
      ]

      let data = null
      let lastError = null

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            data = await response.json()
            break
          } else {
            lastError = `API returned ${response.status}`
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : 'Network error'
          continue
        }
      }

      // If API calls fail, use mock data for demo
      if (!data) {
        console.log('Using mock data - API endpoints unavailable')
        data = getMockData(stealth)
      }

      setPortfolioData(data)
    } catch (err) {
      console.log('Using mock data - Error occurred:', err)
      setPortfolioData(getMockData(stealth))
    } finally {
      setLoading(false)
    }
  }

  const getMockData = (stealth = false) => {
    const baseData = {
      portfolioValue: stealth ? 125000 : 487236,
      totalGainLoss: stealth ? 8500 : 32847,
      totalGainLossPercent: stealth ? 7.24 : 7.24,
      dayChange: stealth ? 1200 : 4651,
      dayChangePercent: stealth ? 0.97 : 0.97,
      accounts: [
        {
          name: 'VHP Investment',
          value: stealth ? 45000 : 175234,
          dayChange: stealth ? 420 : 1623,
          dayChangePercent: 0.94
        },
        {
          name: 'Robinhood',
          value: stealth ? 35000 : 135678,
          dayChange: stealth ? 380 : 1478,
          dayChangePercent: 1.1
        },
        {
          name: 'Roth IRA',
          value: stealth ? 28000 : 108934,
          dayChange: stealth ? 250 : 978,
          dayChangePercent: 0.91
        },
        {
          name: 'HSA',
          value: stealth ? 12000 : 46789,
          dayChange: stealth ? 80 : 312,
          dayChangePercent: 0.67
        },
        {
          name: '401k',
          value: stealth ? 5000 : 19456,
          dayChange: stealth ? 70 : 271,
          dayChangePercent: 1.41
        }
      ],
      topMovers: [
        {
          symbol: 'NVDA',
          change: stealth ? 85 : 328,
          changePercent: 1.89,
          type: 'gainer'
        },
        {
          symbol: 'AAPL',
          change: stealth ? 65 : 251,
          changePercent: 1.42,
          type: 'gainer'
        },
        {
          symbol: 'TSLA',
          change: stealth ? -25 : -97,
          changePercent: -0.87,
          type: 'loser'
        },
        {
          symbol: 'META',
          change: stealth ? 45 : 174,
          changePercent: 0.78,
          type: 'gainer'
        }
      ],
      _timestamp: new Date().toISOString(),
      _cached: false,
      _mockData: true
    }

    return baseData
  }

  const sendEmail = async (stealth = false) => {
    try {
      setEmailSending(true)

      // Try local API first, then cloud
      const endpoints = [
        `http://localhost:3000/api/send-email?mode=${stealth ? 'stealth' : 'real'}`,
        `https://portfolio-automation-nfkyhgeho-jonny-cangemis-projects.vercel.app/api/send-email?mode=${stealth ? 'stealth' : 'real'}`
      ]

      let success = false
      let lastError = null

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            const result = await response.json()
            alert(`✅ ${result.message}`)
            success = true
            break
          } else {
            lastError = `API returned ${response.status}`
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : 'Network error'
          continue
        }
      }

      if (!success) {
        alert(`⚠️ Email service unavailable: ${lastError}. Portfolio API needs to be running.`)
      }

    } catch (err) {
      alert(`❌ Email failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setEmailSending(false)
    }
  }

  useEffect(() => {
    fetchPortfolioData(stealthMode)
  }, [stealthMode]) // eslint-disable-line react-hooks/exhaustive-deps


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={() => fetchPortfolioData(stealthMode)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <p className="text-white text-lg">No portfolio data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" suppressHydrationWarning>
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {stealthMode ? '🥷 Stealth Portfolio' : '📊 Portfolio Dashboard'}
          </h1>
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 pb-20">
        {/* Mode Toggle */}
        <div className="mb-8 text-center">
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setStealthMode(false)}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                !stealthMode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              📊 Real Data
            </button>
            <button
              onClick={() => setStealthMode(true)}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                stealthMode
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🥷 Stealth Mode
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">
              Portfolio Value
            </h3>
            <p className="text-white text-2xl font-bold">
              {formatCurrency(portfolioData.totalValue)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">
              Total Gain/Loss
            </h3>
            <p className={`text-2xl font-bold ${getChangeColor(portfolioData.totalGain)}`}>
              {formatCurrency(portfolioData.totalGain)}
            </p>
            <p className={`text-sm ${getChangeColor(portfolioData.totalGain)}`}>
              {formatPercent((portfolioData.totalPct || 0) * 100)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">
              Day Change
            </h3>
            <p className={`text-2xl font-bold ${getChangeColor(portfolioData.totalGain)}`}>
              {formatCurrency(portfolioData.totalGain)}
            </p>
            <p className={`text-sm ${getChangeColor(portfolioData.totalGain)}`}>
              {formatPercent((portfolioData.totalPct || 0) * 100)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-2">
              Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => sendEmail(stealthMode)}
                disabled={emailSending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                {emailSending ? '⏳ Sending...' : '📧 Send Email'}
              </button>
              <button
                onClick={() => fetchPortfolioData(stealthMode)}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Day Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Change %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {Object.entries(portfolioData.accounts || {}).map(([accountKey, account]: [string, any]) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <tr key={accountKey} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {accountKey === 'selfDirected' ? 'Self-Directed' : accountKey === 'retirement' ? 'Retirement' : accountKey.charAt(0).toUpperCase() + accountKey.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-white">
                      {formatCurrency(account.totalValue || 0)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${getChangeColor(account.dailyGain || 0)}`}>
                      {formatCurrency(account.dailyGain || 0)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${getChangeColor(account.dailyGain || 0)}`}>
                      {formatPercent(((account.dailyGain || 0) / (account.totalValue || 1)) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Movers */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Top Movers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Change %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[
                  ...(portfolioData.topMovers?.gainers || []).map(stock => ({ ...stock, type: 'gainer' })),
                  ...(portfolioData.topMovers?.losers || []).map(stock => ({ ...stock, type: 'loser' }))
                ].slice(0, 10).map((mover, index) => (
                  <tr key={`${mover.symbol}-${index}`} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {mover.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize">
                      {mover.type}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${getChangeColor(mover.daily_gain || 0)}`}>
                      {formatCurrency(mover.daily_gain || 0)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${getChangeColor(mover.daily_gain || 0)}`}>
                      {formatPercent((mover.daily_pct || 0) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {portfolioData._mockData && (
              <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-xs mr-2">
                DEMO DATA
              </span>
            )}
            {portfolioData._cached && (
              <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs mr-2">
                CACHED DATA
              </span>
            )}
            {stealthMode && (
              <span className="bg-purple-600 text-purple-100 px-2 py-1 rounded text-xs mr-2">
                STEALTH MODE
              </span>
            )}
            Last updated: {portfolioData._timestamp ? new Date(portfolioData._timestamp).toLocaleString() : 'Unknown'}
          </p>
          {portfolioData._mockData && (
            <p className="text-gray-500 text-xs mt-2">
              Connect to Portfolio API for live data and email functionality
            </p>
          )}
        </div>
      </main>
    </div>
  )
}