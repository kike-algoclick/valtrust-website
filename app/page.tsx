'use client'
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import LandingFooter from "@/components/layout/footers/landingFooter";
import LandingNav from "@/components/layout/navbars/landingnav";
import { useState } from "react";
import SellOrBuyPopup from "@/components/layout/selection-popup/Choose";

export default function Home() {
   const [popupOpen, setPopupOpen] = useState(false);
  return (
    <div className="flex flex-col bg-zinc-50 font-sans dark:bg-black">
     
 <LandingNav onSignUpClick={() => setPopupOpen(true)} />
    <SellOrBuyPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
      <section className="relative w-full h-[70vh]  md:h-screen overflow-hidden z-1">
        <Image
          src={"/landing-image.png"}
          priority
          className="object-fit object-cover"
          alt={"landing-image"}
          fill
        />

        <div className="absolute inset-0 flex items-center pt-20 md:pt-0r">
          <div className="px-6 md:px-16 max-w-3xl">
            <TypeAnimation
              sequence={[
                "Find Your Dream",
                200,
                "Find Your Dream Land With",
                200,
                "Find Your Dream Land With Valtrust",
              ]}
              wrapper="h1"
              cursor={false}
              speed={50}
              repeat={0}
              className="text-white font-bold leading-tight text-5xl sm:text-6xl md:text-7xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-white w-full flex text-black gap-10 flex-col md:flex-row  items-center justify-center p-5 -mt-30 md:-mt-40 ">
        <div className="relative w-full md:w-1/3 h-80 rounded-3xl shadow-2xl bg-white p-5 z-12  transition-all duration-300 hover:scale-105">
          <Image
            src={"/visualize-homes.png"}
            alt={"Visualize homes Image"}
            className="object-contain rounded-lg"
            fill
          />
        </div>
        <div className="relative w-full md:w-1/3 h-80 rounded-3xl shadow-2xl bg-white p-5 z-12  transition-all duration-300 hover:scale-105">
          <Image
            src={"/top-listing.png"}
            alt={"Top Listing Image"}
            className="object-contain rounded-lg"
            fill
          />
        </div>
        <div className="relative w-full md:w-1/3 h-80 rounded-3xl shadow-2xl bg-white p-5 z-12  transition-all duration-300 hover:scale-105">
          <Image
            src={"/evaluate-land.png"}
            alt={"Evaluate Land Image"}
            className="object-contain rounded-lg"
            fill
          />
        </div>
      </section>

      <section className="bg-white p-5 text-black flex flex-col min-h-full w-full p-20">
        <div className="text-lg flex items-center w-full mt-10 justify-start p-10 font-bold font-sans">
          Explore Our Communities
        </div>

        <div className="flex flex-col  w-full items-center justify-center md:flex-row gap-10 ">
          <div className=" w-full md:w-3/6  lg:w-2/6 sm:w-full flex jusify-center flex-col shadow-2xl rounded-lg gap-2 transition-all duration-300 hover:scale-105">
            <div className="relative w-full  h-70 ">
              <Image
                src={"/santa-tecla.png"}
                alt={"Santa Tecla"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="p-3 font-bold">Santa Tecla</h3>
            <p className="p-2">Urban Area</p>
          </div>

          <div className="w-full md:w-3/6 lg:w-2/6 flex jusify-center flex-col shadow-2xl rounded-lg gap-2 transition-all duration-300 hover:scale-105">
            <div className="relative w-full h-70 ">
              <Image
                src={"/santa-ana.png"}
                alt={"Santa Ana"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="p-3 font-bold">Santa Ana</h3>
            <p className="p-2">Urban Area</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-center w-full bg-white text-black gap-10 p-10">
        <div className="w-full lg:w-2/3  flex justify-center items-center flex-col mt-5 gap-5">
          <h2 className="text-5xl font-bold flex justify-center w-full md:w-2/3 ">
            About Valtrust
          </h2>
          <p className="text-lg md:text-sm w-full  md:w-5/6 sm:p-10">
            We are a digital platform that modernizes property buying, selling,
            and valuation in El Salvador through AI and real market data. We
            connect owners, buyers and investors in a secure and transparent
            environment, making real state decisions easier and smarter.
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-10 items-center justify-center">
          <div className="relative w-4/6 md:w-2/6 h-50 transition-all duration-300 hover:scale-105">
            <Image
              src={"/casa-1.png"}
              alt={"Santa Tecla"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="relative w-4/6 md:w-2/6 h-50 transition-all duration-300 hover:scale-105">
            <Image
              src={"/casa-2.png"}
              alt={"Santa Tecla"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

     <LandingFooter/>
    </div>
  );
}