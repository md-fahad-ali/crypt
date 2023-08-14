import React, { useState } from "react";
import Nav from "./components/nav";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Flowbite theme={{ dark: true }}>
      <div>
        <aside
          id="default-sidebar"
          class="fixed flex top-0 left-0 bg-gray-50 dark:bg-slate-900 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div class={`h-full flex transition-all duration-300 overflow-y-auto`} style={ isOpen ? {width:"inherit"}: {width:"auto"}}>
            <ul class="space-y-2 py-4 font-medium flex p-3 flex-col">
              <li>
                <a href="#" className="flex">
                  <Image
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="h-8"
                    alt="Flowbite Logo"
                    width={50}
                    height={40}
                  />
                  <span className="hidden self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                    Flowbite
                  </span>
                </a>
              </li>
              <br />
              <li className="flex transition-all  origin-top-left transform-cpu duration-150" style={!isOpen ? { height:"0px", transform:"scaleX(0)", width: "0px"}: { transform: "scaleX(1) scaleY(1)"}}>
                <input
                  type="search"
                  name="search"
                  placeholder="Search Community"
                  className="w-full rounded-sm border-r-0 mt-2 bg-transparent transition-all duration-150" 
                />
                <button className="text-white p-1 rounded-l-lg border border-slate-400" onClick={()=>{
                  setIsOpen(!isOpen)
                }}>
                  <IoIosArrowBack/>
                </button>
              </li>
              {!isOpen ? <li>
                <button
                  onClick={(e) => {
                    setIsOpen(!isOpen)
                  }}
                >
                  {/* {!isOpen ?  */}
                  <BiSearch className="dark:text-white text-5xl bg-slate-600 rounded-2xl p-3" /> 
                  {/* // : ""} */}
                </button>
              </li>: ""}
            </ul>
            {!isOpen ? (
              <ul class="space-y-2 pr-2 bg-black pt-4 font-medium">
                <li className="w-1/3">
                  <Image src={"/WalletConnect.png"} className="" alt="wallet" width={100} height={100} />
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </aside>

        <div class="p-4 sm:ml-64"></div>
      </div>
    </Flowbite>
  );
}

export default Dashboard;
