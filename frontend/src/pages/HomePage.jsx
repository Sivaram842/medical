import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-[#0c0f17] text-gray-100">

            <main className="space-y-10 pb-20 pt-6 md:space-y-14">
                <Hero />

                {/* Carousel with dummy images (replace with real later) */}
                <Carousel
                    images={[
                        "https://images.unsplash.com/photo-1529336953121-a3cdd7a4b6b9?q=80&w=1600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1600&auto=format&fit=crop",
                    ]}
                />

                {/* you can drop more sections here (services grid, stats, etc.) */}
            </main>
        </div>
    );
};

export default HomePage;
