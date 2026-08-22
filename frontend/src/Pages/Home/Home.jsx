import Fleet from "../../Components/Carousel/Fleet.jsx";
import Download from "./Download/Download.jsx";
import HomeHero from "./HomeHero/HomeHero.jsx";
import WhyChoose from "./WhyChoose/WhyChoose.jsx";

const Home = () => {
    return (
        <>
            <HomeHero />
            <Fleet />
            <WhyChoose />
            <Download />
        </>
    )
}
export default Home