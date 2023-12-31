"use client";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { Hero } from "@/components/Landing";
import { PillardsStack } from "@/components/Landing";
import { HorizontalFeatures } from "@/components/Landing/HorizontalFeatures";
import { Team } from "@/components/Landing";
import { Footer } from "@/components/Footer";
import { GridPattern } from "@/components/Landing/GridPattern";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto">
          <GridPattern
            className="absolute inset-x-0 -top-14  w-full h-[800px] fill-primary stroke-slate-800 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
            yOffset={10}
            interactive
          />
          <div className="mx-auto flex w-11/12 flex-col relative">
            <Hero />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              viewport={{ once: false }}
              className="flex flex-col items-center"
            >
              <span className="sr-only">Welcome Title & content</span>
              <h2 className="mb-4 text-center text-4xl">
                CrowFunding in{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{
                    opacity: [0, 1, 0, 1, 0, 1],
                    scale: [1, 4, 2, 4, 1],
                    rotate: [0, 0, 270, 270, 0],
                  }}
                  viewport={{ once: false }}
                  transition={{ duration: 1 }}
                  className="text-primary text-5xl bg-surface rounded-md px-2 py-1"
                >
                  3
                </motion.span>{" "}
                Pillards
              </h2>
              <div className="max-w-[900px] text-center px-4 md:px-0 min-h-max">
                <p className="leading-8 font-thin">
                  We are here to change how projects get funded. Whether you are
                  a DAO or an organization, we offer tailored solutions for
                  decentralized communities. Be a part of the crowdfunding
                  revolution, shaping a better tomorrow, many projects at a
                  time.
                </p>
              </div>
            </motion.div>
            <PillardsStack />
            <HorizontalFeatures />
            <Team />
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
