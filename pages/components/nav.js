import Link from "next/link";
import React, { useState } from "react";
import styles from "../../styles/Nav.module.css";
import { Cross as Hamburger } from "hamburger-react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

function Nav(props) {
  // console.log(props?.csrf?.data);
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  // async function getOption(e) {
  //   e.preventDefault()
  // try {
  //   const pro = await axios.delete(`${window.origin}/api/auth/logout`, {
  //     withCredentials: true,
  //   });
  //   console.log(pro);
  //   if (pro.data) {
  //     router.push("/").then(() => router.reload());
  //   }
  // } catch (error) {
  //   console.error("Logout failed:", error);
  // }
  // }
  async function getOption(e) {
    e.preventDefault();
    try {
      const pro = await axios.delete(`${window.origin}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(pro);
      if (pro.data) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <div>
      <div className={styles.desktop}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            CompanyLogo
          </Link>

          <div className={styles.headerRight}>
            <Link className={styles.active} href="/">
              Home
            </Link>
            <Link href="#contact">Contact</Link>
            <Link href="#about">About</Link>

            <div className={styles.dropDown}>
              <Image
                src={`https://avatars.dicebear.com/api/bottts/${props?.user}.svg`}
                alt="Avatar"
                width={57}
                height={57}
                className={styles.avtar}
              />
              <div className={styles.container}>
                <Link
                  href={""}
                  onClick={(e) => {
                    getOption(e);
                  }}
                >
                  Log out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mobile}>
        <div className={styles.header}>
          <Link href="#default" className={styles.logo}>
            CompanyLogo
          </Link>
          <div className={styles.hambarger}>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <div
            className={styles.headerRight}
            style={
              isOpen ? { transform: "scaleY(1)" } : { transform: "scaleY(0)" }
            }
          >
            <div className={styles.links}>
              <Link className={styles.active} href="/">
                Home
              </Link>
              <Link href="#contact">Contact</Link>
              <Link href="#about">About</Link>
              <Link href={"/api/logout"}>Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
