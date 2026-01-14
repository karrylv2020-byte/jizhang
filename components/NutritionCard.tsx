import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FoodAnalysisResult } from '../types';
import { Activity, Flame, Droplet, Wheat, ArrowUpRight } from 'lucide-react';

interface NutritionCardProps {
  data: FoodAnalysisResult;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6']; // Protein (Green), Carbs (Blue), Fat (Orange), Fiber (Purple)

const NutritionCard: React.FC<NutritionCardProps> = ({ data }) => {
  const chartData = [
    { name: '蛋白质', value: data.macros.protein },
    { name: '碳水', value: data.macros.carbs },
    { name: '脂肪', value: data.macros.fat },
    { name: '纤维', value: data.macros.fiber },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.foodName}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{data.description}</p>
          </div>
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shadow-sm
            ${data.healthScore >= 8 ? 'bg-green-100 text-green-700' : 
              data.healthScore >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
          `}>
            {data.healthScore}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Chart Section */}
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
                <span className="block text-3xl font-extrabold text-gray-800">{data.totalCalories}</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">千卡</span>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox icon={<Activity size={18} />} label="蛋白质" value={`${data.macros.protein}克`} color="text-green-600" bg="bg-green-50" />
            <StatBox icon={<Wheat size={18} />} label="碳水" value={`${data.macros.carbs}克`} color="text-blue-600" bg="bg-blue-50" />
            <StatBox icon={<Droplet size={18} />} label="脂肪" value={`${data.macros.fat}克`} color="text-orange-600" bg="bg-orange-50" />
            <StatBox icon={<Flame size={18} />} label="纤维" value={`${data.macros.fiber}克`} color="text-purple-600" bg="bg-purple-50" />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ArrowUpRight size={18} className="text-primary"/> 
                详细成分
            </h3>
            <div className="space-y-3">
                {data.ingredients.map((ing, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="text-gray-700 font-medium">{ing.name}</span>
                        <span className="text-gray-400">{ing.calories} 千卡</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">健康建议</h3>
            <ul className="space-y-2">
                {data.healthTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                        {tip}
                    </li>
                ))}
            </ul>
        </div>

      </div>
    </div>
  );
};

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, bg: string }> = ({ icon, label, value, color, bg }) => (
    <div className={`p-4 rounded-2xl ${bg} flex flex-col items-start gap-1`}>
        <div className={`${color} mb-1 opacity-80`}>{icon}</div>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
        <span className={`text-xl font-bold ${color}`}>{value}</span>
    </div>
);

export default NutritionCard;