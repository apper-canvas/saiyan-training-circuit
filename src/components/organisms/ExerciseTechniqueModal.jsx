import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Tabs } from '@/components/atoms/Tabs';
import ApperIcon from '@/components/ApperIcon';
import { exerciseTechniqueService } from '@/services';

const exerciseAnimationMap = {
  pushUps: 'animate-exercise-demo-pushup',
  sitUps: 'animate-exercise-demo-situp',
  crunches: 'animate-exercise-demo-crunch',
  run: 'animate-exercise-demo-run'
};

const exerciseIconMap = {
  pushUps: 'ArrowUp',
  sitUps: 'RotateCcw',
  crunches: 'Activity',
  run: 'MapPin'
};

const exerciseColorMap = {
  pushUps: 'text-red-400',
  sitUps: 'text-blue-400',
  crunches: 'text-green-400',
  run: 'text-yellow-400'
};

function ExerciseTechniqueModal({ exerciseKey, isOpen, onClose }) {
  const [technique, setTechnique] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    if (isOpen && exerciseKey) {
      loadTechnique();
    }
  }, [isOpen, exerciseKey]);

  const loadTechnique = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await exerciseTechniqueService.getById(exerciseKey);
      setTechnique(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-slate-900 border-2 border-primary/30 shadow-saiyan rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saiyan-gold"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 px-6">
              <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 text-lg">{error}</p>
              <Button onClick={onClose} variant="outline" className="mt-4">
                Close
              </Button>
            </div>
          ) : technique ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-slate-800 border border-slate-600 ${exerciseAnimationMap[exerciseKey]}`}>
                      <ApperIcon 
                        name={exerciseIconMap[exerciseKey]} 
                        className={`h-8 w-8 ${exerciseColorMap[exerciseKey]}`} 
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{technique.name} Technique</h2>
                      <p className="text-gray-400">{technique.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Exercise Info */}
                <div className="flex items-center space-x-4 mt-4">
                  <Badge className={`${getDifficultyColor(technique.difficulty)} border`}>
                    {technique.difficulty}
                  </Badge>
                  <div className="text-sm text-gray-400">
                    Targets: {technique.musclesTargeted.join(', ')}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <div className="px-6 pt-4 border-b border-slate-700">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setActiveTab('form')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'form'
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Proper Form
                      </button>
                      <button
                        onClick={() => setActiveTab('mistakes')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'mistakes'
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Common Mistakes
                      </button>
                      <button
                        onClick={() => setActiveTab('tips')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'tips'
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Tips & Progressions
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === 'form' && (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-400" />
                            <span>Proper Form Guidelines</span>
                          </h3>
                          <div className="space-y-3">
                            {technique.properForm.map((step, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {index + 1}
                                </div>
                                <p className="text-gray-300">{step}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'mistakes' && (
                        <motion.div
                          key="mistakes"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-400" />
                            <span>Common Mistakes to Avoid</span>
                          </h3>
                          <div className="space-y-4">
                            {technique.commonMistakes.map((mistake, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-lg border ${getSeverityColor(mistake.severity)} ${
                                  mistake.severity === 'high' ? 'animate-mistake-warning' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{mistake.issue}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={`${getSeverityColor(mistake.severity)} border-current`}
                                  >
                                    {mistake.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm opacity-90">{mistake.correction}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'tips' && (
                        <motion.div
                          key="tips"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                              <ApperIcon name="Lightbulb" className="h-5 w-5 text-yellow-400" />
                              <span>Training Tips</span>
                            </h3>
                            <div className="space-y-3">
                              {technique.tips.map((tip, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                                >
                                  <ApperIcon name="Star" className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  <p className="text-gray-300">{tip}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                              <ApperIcon name="TrendingUp" className="h-5 w-5 text-blue-400" />
                              <span>Progression Levels</span>
                            </h3>
                            <div className="space-y-3">
                              {technique.progressions.map((progression, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                                >
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {index + 1}
                                  </div>
                                  <p className="text-gray-300">{progression}</p>
                                </motion.div>
                              ))}
                            </div>
</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Tabs>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      // Future: Could integrate with workout tracking
                      onClose();
                    }}
                  >
                    Got It!
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </Dialog>
  );
}

export default ExerciseTechniqueModal;