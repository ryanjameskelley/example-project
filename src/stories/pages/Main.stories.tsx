import type { Meta, StoryObj } from '@storybook/react';
import { PanelLeft, PawPrint, Play, Clock3, Plus, Flame, Heart, MapPin, Target, Camera } from 'lucide-react';
import { MetricCard } from '../../components/ui/metric-card';
import { Button } from '../../components/ui/button';
import { VetAlert } from '../../components/ui/vet-alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { IconTabs, IconTabTrigger } from '../../components/ui/icon-tabs';
import { PlayMetrics } from '../../components/ui/play-metrics';
import { Toaster } from '../../components/ui/sonner';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const MainPage = () => {
  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Top Section - Metric Cards */}
      <div className="flex flex-col gap-2 p-2">
        <MetricCard 
          title="Current BPM"
          value="90"
          trend="+10.2%"
          subtitle="Trending up this month"
          description="Fido might be exercising currently"
        />
        <MetricCard 
          title="Steps today"
          value="235125"
          trend="+12.5%"
          subtitle="Trending up this month"
          description="Yesterdays walk was longer than average"
        />
        <MetricCard 
          title="Food intake today"
          value="4 Ounces"
          trend="-2.8%"
          subtitle="Trending up this month"
          description="Todays walk was longer than average"
        />
      </div>
      
      {/* Bottom Section - Buttons */}
      <div className="flex flex-col gap-2 p-2">
        <Button variant="outline" className="w-full">
          Play log
        </Button>
        <Button variant="default" className="w-full">
          Play
        </Button>
      </div>
    </div>
  );
};

const MainPlayingPage = () => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Vertical Separator */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
          
          {/* Clock Icon */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <Clock3 className="w-4 h-4 text-red-600" />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Top Section - Metric Cards */}
      <div className="flex flex-col gap-2 p-2">
        <MetricCard 
          title="Current BPM"
          value="90"
          trend="+10.2%"
          subtitle="Trending up this month"
          description="Fido might be exercising currently"
        />
        <MetricCard 
          title="Steps today"
          value="235125"
          trend="+12.5%"
          subtitle="Trending up this month"
          description="Yesterdays walk was longer than average"
        />
        <MetricCard 
          title="Food intake today"
          value="4 Ounces"
          trend="-2.8%"
          subtitle="Trending up this month"
          description="Todays walk was longer than average"
        />
      </div>
      
      {/* Bottom Section - Buttons */}
      <div className="flex flex-col gap-2 p-2">
        <Button variant="outline" className="w-full">
          Play log
        </Button>
        <Button variant="destructive" className="w-full">
          {formatTime(seconds)}
        </Button>
      </div>
    </div>
  );
};

// Sample steps data for the chart
const stepsData = [
  { date: "2024-04-01", steps: 15234 },
  { date: "2024-04-02", steps: 18456 },
  { date: "2024-04-03", steps: 22341 },
  { date: "2024-04-04", steps: 28765 },
  { date: "2024-04-05", steps: 31204 },
  { date: "2024-04-06", steps: 26789 },
  { date: "2024-04-07", steps: 24567 },
  { date: "2024-04-08", steps: 29834 },
  { date: "2024-04-09", steps: 18923 },
  { date: "2024-04-10", steps: 25678 },
  { date: "2024-04-11", steps: 32145 },
  { date: "2024-04-12", steps: 28934 },
  { date: "2024-04-13", steps: 26543 },
  { date: "2024-04-14", steps: 23789 },
  { date: "2024-04-15", steps: 21456 },
];

const stepsChartConfig: ChartConfig = {
  steps: {
    label: "Steps",
    color: "#164E63",
  },
};

const StepsChartPage = () => {
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="flex flex-col p-2 overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <h2 className="text-base font-normal text-card-foreground">Steps</h2>
            <p className="text-sm text-muted-foreground">
              Average: 25,928
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-6">
          <ChartContainer
            config={stepsChartConfig}
            className="h-[200px] w-full"
          >
            <AreaChart data={stepsData}>
              <defs>
                <linearGradient id="fillSteps" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#164E63"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#164E63"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="steps"
                type="natural"
                fill="url(#fillSteps)"
                stroke="#164E63"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
        
        {/* Alert Component */}
        <div className="mt-6">
          <VetAlert 
            title="My Vet"
            description="Connect and share vitals with your vet"
            icon={<Plus className="w-4 h-4 text-foreground" />}
          />
        </div>
      </div>
      
      {/* Bottom Section - Buttons */}
      <div className="flex flex-col gap-2 p-2">
        <Button variant="outline" className="w-full">
          Play log
        </Button>
        <Button variant="default" className="w-full">
          Play
        </Button>
      </div>
    </div>
  );
};

// Sample play log data
const playLogData = [
  { date: "April 5, 2025", time: "1H 05" },
  { date: "April 6, 2025", time: "2H 06" },
  { date: "April 7, 2025", time: "1H 17" },
  { date: "April 8, 2025", time: "3H 25" },
  { date: "April 9, 2025", time: "1H 08" },
];

const PlayLogPage = () => {
  const [timeRange, setTimeRange] = useState("90d");
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
          
          {/* Clock Icon */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <Clock3 className="w-4 h-4 text-red-600" />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Table Section */}
      <div className="flex flex-col p-2 overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <h2 className="text-base font-normal text-card-foreground">Play log</h2>
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-foreground" />
              <p className="text-sm text-muted-foreground">
                100 days in a row
              </p>
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-6">
          <div className="w-full">
            {/* Table Header */}
            <div className="flex border-b border-border h-10">
              <div className="flex-1 flex items-center px-2">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
              </div>
              <div className="flex-1 flex items-center justify-end px-2">
                <p className="text-sm font-medium text-muted-foreground">Time</p>
              </div>
            </div>
            
            {/* Table Rows */}
            {playLogData.map((item, index) => (
              <div key={index} className="flex border-b border-border h-[52px]">
                <div className="flex-1 flex items-center px-2">
                  <p className="text-sm font-medium text-foreground">{item.date}</p>
                </div>
                <div className="flex-1 flex items-center justify-end px-2">
                  <p className="text-sm font-normal text-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Button */}
      <div className="flex flex-col p-2">
        <Button variant="destructive" className="w-full">
          {formatTime(seconds)}
        </Button>
      </div>
    </div>
  );
};

const PlayLogStaticPage = () => {
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Table Section */}
      <div className="flex flex-col p-2 overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <h2 className="text-base font-normal text-card-foreground">Play log</h2>
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-foreground" />
              <p className="text-sm text-muted-foreground">
                100 days in a row
              </p>
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-6">
          <div className="w-full">
            {/* Table Header */}
            <div className="flex border-b border-border h-10">
              <div className="flex-1 flex items-center px-2">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
              </div>
              <div className="flex-1 flex items-center justify-end px-2">
                <p className="text-sm font-medium text-muted-foreground">Time</p>
              </div>
            </div>
            
            {/* Table Rows */}
            {playLogData.map((item, index) => (
              <div key={index} className="flex border-b border-border h-[52px]">
                <div className="flex-1 flex items-center px-2">
                  <p className="text-sm font-medium text-foreground">{item.date}</p>
                </div>
                <div className="flex-1 flex items-center justify-end px-2">
                  <p className="text-sm font-normal text-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Buttons */}
      <div className="flex flex-col gap-2 p-2">
        <Button variant="outline" className="w-full">
          Play log
        </Button>
        <Button variant="default" className="w-full">
          Play
        </Button>
      </div>
    </div>
  );
};

const StepsChartPlayingPage = () => {
  const [timeRange, setTimeRange] = useState("90d");
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
          
          {/* Clock Icon */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <Clock3 className="w-4 h-4 text-red-600" />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="flex flex-col p-2 overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col" style={{ gap: '6px' }}>
            <h2 className="text-base font-normal text-card-foreground">Steps</h2>
            <p className="text-sm text-muted-foreground">
              Average: 25,928
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-6">
          <ChartContainer
            config={stepsChartConfig}
            className="h-[200px] w-full"
          >
            <AreaChart data={stepsData}>
              <defs>
                <linearGradient id="fillStepsPlaying" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#164E63"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#164E63"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="steps"
                type="natural"
                fill="url(#fillStepsPlaying)"
                stroke="#164E63"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
        
        {/* Alert Component */}
        <div className="mt-6">
          <VetAlert 
            title="My Vet"
            description="Connect and share vitals with your vet"
            icon={<Plus className="w-4 h-4 text-foreground" />}
          />
        </div>
      </div>
      
      {/* Bottom Section - Buttons */}
      <div className="flex flex-col gap-2 p-2">
        <Button variant="outline" className="w-full">
          Play log
        </Button>
        <Button variant="destructive" className="w-full">
          {formatTime(seconds)}
        </Button>
      </div>
    </div>
  );
};

const InteractivePage = () => {
  const [currentView, setCurrentView] = useState<'main' | 'playing' | 'steps' | 'playlog'>('main');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [playLogEntries, setPlayLogEntries] = useState(playLogData);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayClick = () => {
    setIsTimerActive(true);
    setCurrentView('playing');
  };

  const handleStepsClick = () => {
    setCurrentView('steps');
  };

  const handlePlayLogClick = () => {
    setCurrentView('playlog');
  };

  const handleFidoClick = () => {
    setCurrentView('main');
  };

  const handleClockClick = () => {
    setCurrentView('playing');
  };

  const handleTimerClick = () => {
    if (isTimerActive) {
      // Stop timer and save session
      setIsTimerActive(false);
      
      // Create new play log entry
      const sessionDuration = formatTime(seconds);
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      
      const newEntry = {
        date: currentDate,
        time: sessionDuration
      };
      
      // Add to beginning of play log
      setPlayLogEntries(prev => [newEntry, ...prev]);
      
      // Reset timer
      setSeconds(5);
      
      // Show toast
      toast.success("Play session saved to log!", {
        description: `${sessionDuration} session recorded`
      });
    }
  };

  // Render different views
  if (currentView === 'playing') {
    return (
      <div 
        className="w-screen bg-white grid" 
        style={{ 
          height: '100vh',
          gridTemplateRows: 'auto 1fr auto'
        }}
      >
        {/* Top App Bar */}
        <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-1">
            {/* Menu Button */}
            <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
              <PanelLeft className="w-4 h-4 text-foreground" />
            </div>
            
            {/* Vertical Separator */}
            <div className="w-2 flex items-center justify-center">
              <div className="w-px h-[15px] bg-border"></div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-normal text-foreground whitespace-nowrap cursor-pointer" onClick={handleFidoClick}>
                Fido
              </p>
            </div>
            
            {/* Clock Icon */}
            <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={handleClockClick}>
              <Clock3 className="w-4 h-4 text-red-600" />
            </div>
          </div>
          
          {/* Right Section */}
          <div className="w-9 h-9 flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col overflow-hidden relative">
          {/* Map Container */}
          <div className="flex-1 relative">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600 text-lg font-medium">Map</p>
            </div>
            
            {/* Tabs Overlay - positioned in top right */}
            <div className="absolute top-2 right-2">
              <IconTabs value="location" onValueChange={() => {}}>
                <IconTabTrigger value="location">
                  <MapPin className="w-4 h-4" />
                </IconTabTrigger>
                <IconTabTrigger value="camera">
                  <Camera className="w-4 h-4" />
                </IconTabTrigger>
              </IconTabs>
            </div>
          </div>
          
          {/* Play Metrics Row */}
          <div className="flex gap-2 pt-2 px-2">
            <div className="flex-1">
              <PlayMetrics 
                title="BPM"
                value="90"
                average="65 Avg"
                icon={<Heart className="w-4 h-4" />}
              />
            </div>
            <div className="flex-1">
              <PlayMetrics 
                title="Steps"
                value="14"
                average="29,3858 Avg"
                icon={<PawPrint className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Button */}
        <div className="flex flex-col p-2">
          <Button variant="destructive" className="w-full" onClick={handleTimerClick}>
            {formatTime(seconds)}
          </Button>
        </div>
      </div>
    );
  }

  if (currentView === 'steps') {
    return (
      <div 
        className="w-screen bg-white grid" 
        style={{ 
          height: '100vh',
          gridTemplateRows: 'auto 1fr auto'
        }}
      >
        {/* Top App Bar */}
        <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-1">
            {/* Menu Button */}
            <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
              <PanelLeft className="w-4 h-4 text-foreground" />
            </div>
            
            {/* Separator Wrapper */}
            <div className="w-2 flex items-center justify-center">
              <div className="w-px h-[15px] bg-border"></div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-normal text-foreground whitespace-nowrap cursor-pointer" onClick={handleFidoClick}>
                Fido
              </p>
            </div>
            {isTimerActive && (
              <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={handleClockClick}>
                <Clock3 className="w-4 h-4 text-red-600" />
              </div>
            )}
          </div>
          
          {/* Right Section */}
          <div className="w-9 h-9 flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="flex flex-col p-2 overflow-hidden">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <h2 className="text-base font-normal text-card-foreground">Steps</h2>
              <p className="text-sm text-muted-foreground">
                Average: 25,928
              </p>
            </div>
            <Select value="90d" onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-6">
            <ChartContainer
              config={stepsChartConfig}
              className="h-[200px] w-full"
            >
              <AreaChart data={stepsData}>
                <defs>
                  <linearGradient id="fillStepsInteractive" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#164E63"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#164E63"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="steps"
                  type="natural"
                  fill="url(#fillStepsInteractive)"
                  stroke="#164E63"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
          
          {/* Alert Component */}
          <div className="mt-6">
            <VetAlert 
              title="My Vet"
              description="Connect and share vitals with your vet"
              icon={<Plus className="w-4 h-4 text-foreground" />}
            />
          </div>
        </div>
        
        {/* Bottom Section - Buttons */}
        <div className="flex flex-col gap-2 p-2">
          <Button variant="outline" className="w-full" onClick={handlePlayLogClick}>
            Play log
          </Button>
          {isTimerActive ? (
            <Button variant="destructive" className="w-full" onClick={handleTimerClick}>
              {formatTime(seconds)}
            </Button>
          ) : (
            <Button variant="default" className="w-full" onClick={handlePlayClick}>
              Play
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'playlog') {
    return (
      <div 
        className="w-screen bg-white grid" 
        style={{ 
          height: '100vh',
          gridTemplateRows: 'auto 1fr auto'
        }}
      >
        {/* Top App Bar */}
        <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-1">
            {/* Menu Button */}
            <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
              <PanelLeft className="w-4 h-4 text-foreground" />
            </div>
            
            {/* Separator Wrapper */}
            <div className="w-2 flex items-center justify-center">
              <div className="w-px h-[15px] bg-border"></div>
            </div>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-normal text-foreground whitespace-nowrap cursor-pointer" onClick={handleFidoClick}>
                Fido
              </p>
            </div>
            {isTimerActive && (
              <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={handleClockClick}>
                <Clock3 className="w-4 h-4 text-red-600" />
              </div>
            )}
          </div>
          
          {/* Right Section */}
          <div className="w-9 h-9 flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Table Section */}
        <div className="flex flex-col p-2 overflow-hidden">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col" style={{ gap: '6px' }}>
              <h2 className="text-base font-normal text-card-foreground">Play log</h2>
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-foreground" />
                <p className="text-sm text-muted-foreground">
                  100 days in a row
                </p>
              </div>
            </div>
            <Select value="90d" onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-6">
            <div className="w-full">
              {/* Table Header */}
              <div className="flex border-b border-border h-10">
                <div className="flex-1 flex items-center px-2">
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                </div>
                <div className="flex-1 flex items-center justify-end px-2">
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                </div>
              </div>
              
              {/* Table Rows */}
              {playLogEntries.map((item, index) => (
                <div key={index} className="flex border-b border-border h-[52px]">
                  <div className="flex-1 flex items-center px-2">
                    <p className="text-sm font-medium text-foreground">{item.date}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-end px-2">
                    <p className="text-sm font-normal text-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Button */}
        <div className="flex flex-col p-2">
          {isTimerActive ? (
            <Button variant="destructive" className="w-full" onClick={handleTimerClick}>
              {formatTime(seconds)}
            </Button>
          ) : (
            <Button variant="default" className="w-full" onClick={handlePlayClick}>
              Play
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Main/Default view
  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap cursor-pointer" onClick={handleFidoClick}>
              Fido
            </p>
          </div>
          {isTimerActive && (
            <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer" onClick={handleClockClick}>
              <Clock3 className="w-4 h-4 text-red-600" />
            </div>
          )}
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Top Section - Metric Cards */}
      <div className="flex flex-col gap-2 pt-2 px-2">
        <MetricCard 
          title="Current BPM"
          value="90"
          trend="+10.2%"
          subtitle="Trending up this month"
          description="Fido might be exercising currently"
        />
        <div onClick={handleStepsClick} className="cursor-pointer">
          <MetricCard 
            title="Steps today"
            value="235125"
            trend="+12.5%"
            subtitle="Trending up this month"
            description="Yesterdays walk was longer than average"
          />
        </div>
        <MetricCard 
          title="Food intake today"
          value="4 Ounces"
          trend="-2.8%"
          subtitle="Trending up this month"
          description="Todays walk was longer than average"
        />
      </div>
      
      {/* Bottom Section - Buttons */}
      <div className="flex flex-col gap-2 p-2">
        <Button variant="outline" className="w-full" onClick={handlePlayLogClick}>
          Play log
        </Button>
        {isTimerActive ? (
          <Button variant="destructive" className="w-full" onClick={handleTimerClick}>
            {formatTime(seconds)}
          </Button>
        ) : (
          <Button variant="default" className="w-full" onClick={handlePlayClick}>
            Play
          </Button>
        )}
      </div>
      <Toaster />
    </div>
  );
};

const PlayingPage = () => {
  const [activeTab, setActiveTab] = useState("location");
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="w-screen bg-white grid" 
      style={{ 
        height: '100vh',
        gridTemplateRows: 'auto 1fr auto'
      }}
    >
      {/* Top App Bar */}
      <div className="w-full bg-white border-b border-border p-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <PanelLeft className="w-4 h-4 text-foreground" />
          </div>
          
          {/* Separator Wrapper */}
          <div className="w-2 flex items-center justify-center">
            <div className="w-px h-[15px] bg-border"></div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-normal text-foreground whitespace-nowrap">
              Fido
            </p>
          </div>
          
          {/* Clock Icon */}
          <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <Clock3 className="w-4 h-4 text-red-600" />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="w-9 h-9 flex items-center justify-center">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col overflow-hidden relative">
        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600 text-lg font-medium">Map</p>
          </div>
          
          {/* Tabs Overlay - positioned in top right */}
          <div className="absolute top-2 right-2">
            <IconTabs value={activeTab} onValueChange={setActiveTab}>
              <IconTabTrigger value="location">
                <MapPin className="w-4 h-4" />
              </IconTabTrigger>
              <IconTabTrigger value="camera">
                <Camera className="w-4 h-4" />
              </IconTabTrigger>
            </IconTabs>
          </div>
        </div>
        
        {/* Play Metrics Row */}
        <div className="flex gap-2 pt-2 px-2">
          <div className="flex-1">
            <PlayMetrics 
              title="BPM"
              value="90"
              average="65 Avg"
              icon={<Heart className="w-4 h-4" />}
            />
          </div>
          <div className="flex-1">
            <PlayMetrics 
              title="Steps"
              value="14"
              average="29,3858 Avg"
              icon={<Target className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Button */}
      <div className="flex flex-col p-2">
        <Button variant="destructive" className="w-full">
          {formatTime(seconds)}
        </Button>
      </div>
    </div>
  );
};

const meta = {
  title: 'Pages/Main',
  component: MainPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MainPlaying: Story = {
  render: () => <MainPlayingPage />,
};

export const StepsChart: Story = {
  render: () => <StepsChartPage />,
};

export const PlayLogPlaying: Story = {
  render: () => <PlayLogPage />,
};

export const PlayLog: Story = {
  render: () => <PlayLogStaticPage />,
};

export const StepsChartPlaying: Story = {
  render: () => <StepsChartPlayingPage />,
};

export const Playing: Story = {
  render: () => <PlayingPage />,
};

export const Interactive: Story = {
  render: () => <InteractivePage />,
};