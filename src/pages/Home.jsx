import React from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saiyan-orange/20 to-saiyan-gold/20"></div>
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ApperIcon name="Zap" className="h-12 w-12 sm:h-16 sm:w-16 text-saiyan-gold animate-power-pulse" />
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-saiyan-gold via-saiyan-orange to-saiyan-gold bg-clip-text text-transparent mb-4">
              SAIYAN TRAINING
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Transform from earthling to legendary Super Saiyan through daily training.
              Complete your workout regimen and power up through the ranks!
            </p>
          </div>
        </div>
      </header>

      {/* Main Training Interface */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <MainFeature />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 sm:mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              "The training never ends. Keep pushing your limits!" - Goku
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <ApperIcon name="Flame" className="h-5 w-5 text-saiyan-orange" />
              <span className="text-gray-500 text-sm">Saiyan Training Academy</span>
              <ApperIcon name="Flame" className="h-5 w-5 text-saiyan-orange" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home