import Header from './Header.jsx';
import TodayChallenge from './TodayChallenge.jsx';
import GettingStarted from './GettingStarted.jsx';
import LearningPath from './LearningPath.jsx';
import StatsBar from './StatsBar.jsx';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Header />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GettingStarted />
          <TodayChallenge />
          <LearningPath />
        </div>
        <div className="lg:col-span-1">
          <StatsBar />
        </div>
      </div>
    </div>
  );
}