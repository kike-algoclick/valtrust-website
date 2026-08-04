"use client";
import Image from "next/image";
import { X, House, Gem, Settings, Landmark, Activity,PanelRight, Info, Store } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";


export default function SellerNav() {
   const {user} = useUser();
  const userRole = user?.unsafeMetadata?.role;
  const [role, setRole] = useState()
 
  const [open, setOpen] = useState(false);
  return (
    <nav className=" fixed top-0 left-0 bg-wh-main text-sm text-black w-full min-height  z-50 fixed backdrop-blur-md">
      <div className="flex items-center h-20">
        <div className="mt-3 w-1/3s items-center justify-between">
          <Image
            src={"/LogosValtrust/valtrust-isologo.png"}
            alt="Logo Image"
            width={200}
            height={200}
          />
        </div>

        <div className="md:block hidden w-2/3 md:text-md ">
          <ul className="flex justify-end items-center gap-2">
            <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center ">
            <Link href={"/seller"}>
              Home
              </Link>
            </li>

            <li className="hover:bg-zinc-300 p-3 rounded-2xl w-2/9 flex justify-center ">
              Marketplace
            </li>
            <li className="hover:bg-zinc-300 p-3 rounded-2xl w-2/9 flex justify-center ">
            
            <Link href={"/seller/Valuation"}>
              Valuation
          </Link>
            </li>
            <li className="hover:bg-zinc-300 p-3 rounded-2xl w-2/9 flex justify-center ">
              Premium
            </li>
          </ul>
        </div>

        <div className="flex flex w-full justify-end md:hidden items-center">
          <button className="flex justify-center items-center rounded-full w-1/9 h-14">
            {<div className=" w-1/3 gap-2 flex items-center justify-center rounded-lg rounded-full scale-170">
             <UserButton appearance={{
          elements: {
            avatarBox: "w-100 h-100",
          },
        }} />
            </div>}

        

          </button>
          <button
            className="text-3xl md:hidden w-1-2 justify-end items-center p-5 flex items-center flex-3z-50 z-20"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={35} color="gray" className="opacity-100 scale-100 translate-y-0" />
            ) : (
              <PanelRight size={35} color="gray" className="scale-95 pointer-events-none" />
            )}
          </button>
        </div>
        

        <div className="flex justify-end md:flex hidden items-center w-1/3 text-md">
          <button className="w-2/6 p-3 rounded-2xl hover:bg-zinc-300">
            Saved Listing
          </button>
          <div className="w-1/3 flex gap-10 justify-start">
            <button className="w-2/8 p-3 rounded-lg rounded-full">
              <Settings />
            </button>
            <div className=" w-1/3 gap-2 flex items-center justify-center rounded-lg rounded-full scale-150">
             <UserButton appearance={{
          elements: {
            avatarBox: "w-100 h-100",
          },
        }} />
            </div>
          </div>
        </div>
      </div>

    
        <div className= {`  ${open ? "" : "translate-x-full"

          } transform transition-transform duration-300 ease-in-out flex text-black flex-col md:hidden w-50 p-10 fixed bg-wh-main items-center  h-screen top-0 right-0
           gap-20 text-xl z-10   shadow-lg  border-white mt-20 overflow-scroll `}>
           
          <div className="flex flex-col items-center text-left gap-8 overflow-scroll ">

            <div className="w-full flex gap-2 justify-center items-center ">
              <House size={30} color="gray" />
              <h3 className="w-full flex flex-col">Home</h3>
            </div>
            <hr className=" bg-gray-200 w-full" />
            <div className="w-full flex gap-2 justify-center items-center">
              <Store size={30} color="gray" />
              <h3 className="w-full flex flex-col">Marketplace</h3>
            </div>
            <hr className=" bg-gray-200 w-full" />
            <div className="w-full flex gap-2 justify-center items-center">
              <Activity size={30} color="gray"/>
              <h3 className="w-full flex flex-col">Valuation</h3>
            </div>
            <hr className=" bg-gray-200 w-full" />
            <div className="w-full flex gap-2 justify-center items-center">
              <Gem size={30} color="gray" />
              <h3 className="w-full flex flex-col">Premium</h3>
            </div>
            <hr className=" bg-gray-200 w-full" />
            <div className="w-full flex gap-2 justify-center items-center">
              <Info size={30} color="gray" />
              <h3 className="w-full flex flex-col">About Us</h3>
            </div>
            <hr className=" bg-gray-200 w-full" />

            <div className="bg-gr-main p-2 rounded-lg ">
          <div className="w-full  text-white text-bold text-lg flex gap-2 justify-center items-center  rounded-lg">
              <Settings size={40} color="white" className="" />
              <h3 className="w-full flex flex-col">Settings</h3>
            </div>
          </div>
             
          </div>
          
        </div>
      
    </nav>
  );
}