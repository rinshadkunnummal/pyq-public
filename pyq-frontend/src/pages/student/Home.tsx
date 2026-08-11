import Hero from "../../components/home/Hero"
import RecentPapers from "../../components/home/RecentPapers"
import StatsStrip from "../../components/home/StatsStrip"

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      <Hero />
      <RecentPapers />
      <StatsStrip />
    </div>
  )
}