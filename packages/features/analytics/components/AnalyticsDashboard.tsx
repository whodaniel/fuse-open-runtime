import React from "react";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import react_1 from 'react';
import material_1 from '@mui/material';
import recharts_1 from 'recharts';
import icons_material_1 from '@mui/icons-material';
import { format, endOfDay, startOfDay, subDays } from 'date-fns';
import axios_1 from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = (0, react_1.useState)('7d');
    const [analyticsData, setAnalyticsData] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    
    (0, react_1.useEffect)(() => {
        fetchAnalyticsData();
    }, [timeRange]);
    
    const getFallbackAnalyticsData = () => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const weeklyData = Array.from({ length: Math.min(days, 7) }, (_, i) => ({
            day: format(subDays(new Date(), 6 - i), 'MMM dd'),
            messages: Math.floor(Math.random() * 500) + 100
        }));
        
        return {
            messageStats: {
                total: 12457,
                activeUsers: 892
            },
            contentAnalysis: {
                sentiment: {
                    positive: 65,
                    neutral: 25,
                    negative: 10
                },
                topics: [
                    { topic: 'Support', count: 342 },
                    { topic: 'Features', count: 287 },
                    { topic: 'Bugs', count: 156 },
                    { topic: 'Feedback', count: 219 }
                ]
            },
            moderationStats: {
                actions: {
                    warns: 42,
                    mutes: 18,
                    bans: 7,
                    deletes: 125
                },
                appeals: {
                    pending: 12,
                    approved: 8,
                    rejected: 4
                }
            },
            userEngagement: {
                weekly: weeklyData,
                retention: [
                    { day: 'Day 1', rate: 100 },
                    { day: 'Day 3', rate: 68 },
                    { day: 'Day 7', rate: 45 },
                    { day: 'Day 14', rate: 32 },
                    { day: 'Day 30', rate: 21 }
                ]
            }
        };
    };
    
    const fetchAnalyticsData = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const endDate = endOfDay(new Date());
            const startDate = startOfDay(subDays(endDate, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90));
            
            const response = await axios_1.default.get('/api/analytics', {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                },
                timeout: 10000
            });
            
            setAnalyticsData(response.data);
        }
        catch (error) {
            console.warn('Analytics API unavailable, using fallback data:', error.message);
            setError(error);
            setAnalyticsData(getFallbackAnalyticsData());
        }
        finally {
            setIsLoading(false);
        }
    };
    
    const exportData = async (): Promise<void> => {
        try {
            const response = await axios_1.default.get('/api/analytics/export', {
                responseType: 'blob',
                timeout: 15000
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analytics_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
        catch (error) {
            console.error('Error exporting data:', error);
            alert('Analytics export is temporarily unavailable. Please try again later.');
        }
    };
    
    const renderWarningBanner = () => {
        if (!error) return null;
        
        return (
            <material_1.Alert severity="warning" sx={{ mb: 3 }} action={
                <material_1.Button color="inherit" size="small" onClick={fetchAnalyticsData}>
                    Retry
                </material_1.Button>
            }>
                <material_1.AlertTitle>Analytics Service Unavailable</material_1.AlertTitle>
                Showing cached demo data. Real analytics will appear when the service is restored.
            </material_1.Alert>
        );
    };
    
    const renderMessageStats = () => (<material_1.Grid container spacing={2}>
      <material_1.Grid item xs={12} md={8}>
        <material_1.Paper sx={{ p: 2, height: '400px' }}>
          <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <material_1.Typography variant="h6">Message Volume Trend</material_1.Typography>
            <material_1.Tooltip title="Messages sent over time">
              <icons_material_1.Info fontSize="small"/>
            </material_1.Tooltip>
          </material_1.Box>
          <recharts_1.ResponsiveContainer>
            <recharts_1.AreaChart data={analyticsData?.userEngagement?.weekly || []}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="day"/>
              <recharts_1.YAxis />
              <recharts_1.Tooltip />
              <recharts_1.Area type="monotone" dataKey="messages" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3}/>
            </recharts_1.AreaChart>
          </recharts_1.ResponsiveContainer>
        </material_1.Paper>
      </material_1.Grid>
      <material_1.Grid item xs={12} md={4}>
        <material_1.Grid container spacing={2}>
          <material_1.Grid item xs={6}>
            <material_1.Card>
              <material_1.CardContent>
                <material_1.Typography color="textSecondary" gutterBottom>
                  Total Messages
                </material_1.Typography>
                <material_1.Typography variant="h4">
                  {analyticsData?.messageStats?.total?.toLocaleString() || '-'}
                </material_1.Typography>
              </material_1.CardContent>
            </material_1.Card>
          </material_1.Grid>
          <material_1.Grid item xs={6}>
            <material_1.Card>
              <material_1.CardContent>
                <material_1.Typography color="textSecondary" gutterBottom>
                  Active Users
                </material_1.Typography>
                <material_1.Typography variant="h4">
                  {analyticsData?.messageStats?.activeUsers?.toLocaleString() || '-'}
                </material_1.Typography>
              </material_1.CardContent>
            </material_1.Card>
          </material_1.Grid>
        </material_1.Grid>
      </material_1.Grid>
    </material_1.Grid>);
    
    const renderContentAnalysis = () => (<material_1.Grid container spacing={2}>
      <material_1.Grid item xs={12} md={6}>
        <material_1.Paper sx={{ p: 2, height: '300px' }}>
          <material_1.Typography variant="h6" gutterBottom>
            Sentiment Distribution
          </material_1.Typography>
          <recharts_1.ResponsiveContainer>
            <recharts_1.PieChart>
              <recharts_1.Pie data={[
            {
                name: 'Positive',
                value: analyticsData?.contentAnalysis?.sentiment?.positive || 0,
            },
            {
                name: 'Neutral',
                value: analyticsData?.contentAnalysis?.sentiment?.neutral || 0,
            },
            {
                name: 'Negative',
                value: analyticsData?.contentAnalysis?.sentiment?.negative || 0,
            },
        ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                {COLORS.map((color, index) => (<recharts_1.Cell key={`cell-${index}`} fill={color}/>))}
              </recharts_1.Pie>
              <recharts_1.Legend />
              <recharts_1.Tooltip />
            </recharts_1.PieChart>
          </recharts_1.ResponsiveContainer>
        </material_1.Paper>
      </material_1.Grid>
      <material_1.Grid item xs={12} md={6}>
        <material_1.Paper sx={{ p: 2, height: '300px' }}>
          <material_1.Typography variant="h6" gutterBottom>
            Top Topics
          </material_1.Typography>
          <recharts_1.ResponsiveContainer>
            <recharts_1.BarChart data={analyticsData?.contentAnalysis?.topics || []}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="topic"/>
              <recharts_1.YAxis />
              <recharts_1.Tooltip />
              <recharts_1.Bar dataKey="count" fill="#8884d8">
                {analyticsData?.contentAnalysis?.topics?.map((entry, index) => (<recharts_1.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
              </recharts_1.Bar>
            </recharts_1.BarChart>
          </recharts_1.ResponsiveContainer>
        </material_1.Paper>
      </material_1.Grid>
    </material_1.Grid>);
    
    const renderModerationStats = () => (<material_1.Grid container spacing={2}>
      <material_1.Grid item xs={12} md={6}>
        <material_1.Paper sx={{ p: 2, height: '300px' }}>
          <material_1.Typography variant="h6" gutterBottom>
            Moderation Actions
          </material_1.Typography>
          <recharts_1.ResponsiveContainer>
            <recharts_1.BarChart data={[
            {
                name: 'Warns',
                value: analyticsData?.moderationStats?.actions?.warns || 0,
            },
            {
                name: 'Mutes',
                value: analyticsData?.moderationStats?.actions?.mutes || 0,
            },
            {
                name: 'Bans',
                value: analyticsData?.moderationStats?.actions?.bans || 0,
            },
            {
                name: 'Deletes',
                value: analyticsData?.moderationStats?.actions?.deletes || 0,
            },
        ]}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="name"/>
              <recharts_1.YAxis />
              <recharts_1.Tooltip />
              <recharts_1.Bar dataKey="value" fill="#8884d8">
                {COLORS.map((color, index) => (<recharts_1.Cell key={`cell-${index}`} fill={color}/>))}
              </recharts_1.Bar>
            </recharts_1.BarChart>
          </recharts_1.ResponsiveContainer>
        </material_1.Paper>
      </material_1.Grid>
      <material_1.Grid item xs={12} md={6}>
        <material_1.Paper sx={{ p: 2, height: '300px' }}>
          <material_1.Typography variant="h6" gutterBottom>
            Appeals Status
          </material_1.Typography>
          <recharts_1.ResponsiveContainer>
            <recharts_1.PieChart>
              <recharts_1.Pie data={[
            {
                name: 'Pending',
                value: analyticsData?.moderationStats?.appeals?.pending || 0,
            },
            {
                name: 'Approved',
                value: analyticsData?.moderationStats?.appeals?.approved || 0,
            },
            {
                name: 'Rejected',
                value: analyticsData?.moderationStats?.appeals?.rejected || 0,
            },
        ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                {COLORS.map((color, index) => (<recharts_1.Cell key={`cell-${index}`} fill={color}/>))}
              </recharts_1.Pie>
              <recharts_1.Legend />
              <recharts_1.Tooltip />
            </recharts_1.PieChart>
          </recharts_1.ResponsiveContainer>
        </material_1.Paper>
      </material_1.Grid>
    </material_1.Grid>);
    
    const renderUserEngagement = () => (<material_1.Grid container spacing={2}>
      <material_1.Grid item xs={12}>
        <material_1.Paper sx={{ p: 2, height: '300px' }}>
          <material_1.Typography variant="h6" gutterBottom>
            User Retention
          </material_1.Typography>
          <recharts_1.ResponsiveContainer>
            <recharts_1.LineChart data={analyticsData?.userEngagement?.retention || []}>
              <recharts_1.CartesianGrid strokeDasharray="3 3"/>
              <recharts_1.XAxis dataKey="day"/>
              <recharts_1.YAxis domain={[0, 100]} unit="%"/>
              <recharts_1.Tooltip />
              <recharts_1.Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }}/>
            </recharts_1.LineChart>
          </recharts_1.ResponsiveContainer>
        </material_1.Paper>
      </material_1.Grid>
    </material_1.Grid>);
    
    if (isLoading) {
        return (
            <material_1.Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <material_1.CircularProgress size={48} />
                <material_1.Typography variant="h6" sx={{ mt: 2 }}>
                    Loading analytics dashboard...
                </material_1.Typography>
            </material_1.Box>
        );
    }
    
    return (<material_1.Box sx={{ p: 3 }}>
      <material_1.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <material_1.Typography variant="h4">Analytics Dashboard</material_1.Typography>
        <material_1.Box display="flex" gap={2}>
          <material_1.FormControl size="small">
            <material_1.InputLabel>Time Range</material_1.InputLabel>
            <material_1.Select value={timeRange} label="Time Range" onChange={(e) => setTimeRange(e.target.value)}>
              <material_1.MenuItem value="7d">Last 7 Days</material_1.MenuItem>
              <material_1.MenuItem value="30d">Last 30 Days</material_1.MenuItem>
              <material_1.MenuItem value="90d">Last 90 Days</material_1.MenuItem>
            </material_1.Select>
          </material_1.FormControl>
          <material_1.Button variant="outlined" startIcon={<icons_material_1.Download />} onClick={exportData}>
            Export
          </material_1.Button>
          <material_1.IconButton onClick={fetchAnalyticsData} disabled={isLoading}>
            <icons_material_1.Refresh />
          </material_1.IconButton>
        </material_1.Box>
      </material_1.Box>

      {renderWarningBanner()}

      <material_1.Grid container spacing={3}>
        <material_1.Grid item xs={12}>
          {renderMessageStats()}
        </material_1.Grid>
        <material_1.Grid item xs={12}>
          {renderContentAnalysis()}
        </material_1.Grid>
        <material_1.Grid item xs={12}>
          {renderModerationStats()}
        </material_1.Grid>
        <material_1.Grid item xs={12}>
          {renderUserEngagement()}
        </material_1.Grid>
      </material_1.Grid>
    </material_1.Box>);
};

exports.default = AnalyticsDashboard;
export {};
