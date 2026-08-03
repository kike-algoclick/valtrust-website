  "use client";
  import Image from "next/image";
  import { Menu, X, House, SwatchBook, Gem, PanelRight, Info } from "lucide-react";
  import { useState } from "react";
  import Link from "next/link";
  import { Router } from "next/router";
  interface LandingNavProps {
    onSignUpClick: () => void;
  }


  export default function LandingNav({ onSignUpClick }: LandingNavProps) {
    const [open, setOpen] = useState(false);
    return (
      <nav className=" fixed top-0 left-0 bg-wh-main text-sm text-black w-full min-height z-50 fixed backdrop-blur-md">
        <div className="flex items-center h-20">
          <div className="mt-3 w-1/3s items-center justify-between">
          <Link href={"/"} className="mt-3 w-1/3  items-center justify-between">
            <Image
              src={"/LogosValtrust/valtrust-isologo.png"}
              alt="Logo Image"
              width={200}
              height={200}
            
            />
            </Link>
            
          </div>

          <div className="md:block hidden w-2/3 md:text-md">
            <ul className="flex justify-end items-center gap-10">
              <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center ">
              <Link href={"/"}>
                Home
                </Link>
              </li>
              <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center ">
              <Link href={"/aboutUs"}>
                About Us
                </Link>
              </li>
              <li className="hover:bg-zinc-300 p-3 rounded-4xl w-2/9 flex justify-center">
                <Link href={"/premium"}>
                Premium
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex md:hidden p-2 w-full items-center justify-center gap-5 text-sm md:text-sm" >
          <button className="p-3 bg-zinc-200 w-1/2 rounded-lg font-bold">
          <Link href={"/login"}>
            Sign In
            </Link>
          </button>
          <button className="p-3 bg-bl-main  w-1/2 rounded-lg text-white font-bold" onClick={onSignUpClick}>
          

            Sign Up
          
          </button>
          </div>

          <div className="flex flex-col w-1/3 justify-end md:hidden ">
            <button
              className="text-3xl md:hidden w-full justify-end items-center p-5 flex items-center flex-3z-50 z-20"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X size={30} color="gray" className="opacity-100 scale-100 translate-y-0" />
              ) : (
                <PanelRight
                  size={30}
                  color="gray"
                  className="scale-95 pointer-events-none gray-100"
                />
              )}
            </button>
          </div>

          <div className="flex justify-center md:flex hidden font-bold items-center w-1/3 gap-5 text-md">
            <button className="w-1/3 bg-bl-main p-3 rounded-lg text-white" onClick={onSignUpClick}>
            

            Sign Up
          
            </button>
            <button className="w-1/3 bg-zinc-200 p-3 rounded-lg"><Link href={"/login"}>
            Sign In
            </Link></button>
          </div>
        </div>

        
          <div className= {`  ${open ? "" : "translate-x-full"

          } transform transition-transform duration-300 ease-in-out flex text-black flex-col md:hidden w-50 p-10 fixed bg-wh-main items-center  h-screen top-0 right-0
           gap-20 text-xl z-10   shadow-lg  border-white mt-20`}>
            <div className="flex flex-col items-center text-left gap-8 ">
              
              <div className="w-full ">
                <Link href={"/"} className="flex gap-2 justify-center items-center">
                <House size={30} color="gray"/>
                <h3 className="w-full flex flex-col">Home</h3>
                </Link>
                
              </div>
               <hr className=" bg-gray-200 w-full" />
              <div className="w-full ">
                <Link href={"aboutUs"} className="flex gap-2 justify-center items-center">
                <Info size={30} color="gray" />
                <h3 className="w-full flex flex-col">About Us</h3>
                </Link>
              </div>
              <hr className=" bg-gray-200  w-full" />
              <div className="w-full flex gap-2 justify-center items-center">
                <Link href={"premium"} className="flex gap-2 justify-center items-center">
  
                <Gem size={30} color="gray"/>
                <h3 className="w-full flex flex-col">Premium</h3>
                </Link>
              </div>
              <hr className=" bg-gray-200 w-full" />
            </div>

            <div className="flex justify-center flex-col font-bold items-center w-full gap-5 text-md">
            <button className="w-full bg-bl-main p-3 rounded-lg text-white" onClick={onSignUpClick}>
            

            Sign Up
          
            </button>
             <span className="text-sm text-gray-400">OR</span>
            <button className="w-full bg-zinc-200 p-3 rounded-lg"><Link href={"/login"}>
            Sign In
            </Link></button>
          </div>
          </div>
      


       
      </nav>
    );
  }