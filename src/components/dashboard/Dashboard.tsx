import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Zap
} from 'lucide-react';
import { Card } from '../common/Card';

const stats = [
  {
    title: 'Active Tests',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: FileText,
    color: 'text-blue-400'
  },
  {
    title: 'Self-Healing Events',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Zap,
    color: 'text-green-400'
  },
  {
    title: 'Success Rate',
    value: '94.5%',
    change: '+2.1%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-emerald-400'
  },
  {
    title: 'Avg. Runtime',
    value: '2.4m',
    change: '-15%',
    trend: 'down',
    icon: Clock,
    color: 'text-purple-400'
  }
];

const recentTests = [
  {
    id: 1,
    name: 'Login Flow Test',
    status: 'passed',
    lastRun: '2 hours ago',
    duration: '45s',
    healingEvents: 2
  },
  {
    id: 2,
    name: 'Checkout Process',
    status: 'failed',
    lastRun: '4 hours ago',
    duration: '1m 23s',
    healingEvents: 0
  },
  {
    id: 3,
    name: 'User Registration',
    status: 'passed',
    lastRun: '6 hours ago',
    duration: '32s',
    healingEvents: 1
  },
  {
    id: 4,
    name: 'Product Search',
    status: 'passed',
    lastRun: '8 hours ago',
    duration: '28s',
    healingEvents: 3
  }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">PlaywrightAI</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Generate intelligent, self-healing Playwright tests with advanced automation and seamless CI/CD integration
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glowEffect className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
                <div className={`text-xs flex items-center justify-center gap-1 ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Tests */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Test Runs</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
            </div>
            
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      test.status === 'passed' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <div className="text-white font-medium">{test.name}</div>
                      <div className="text-sm text-gray-400">
                        {test.lastRun} • {test.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {test.healingEvents > 0 && (
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Zap className="h-3 w-3" />
                        {test.healingEvents}
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      test.status === 'passed' 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {test.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                Create New Test
              </button>
              <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                Import Existing Tests
              </button>
              <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                View Documentation
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Test Runner</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Self-Healing</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">CI/CD Integration</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 text-sm">Partial</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}