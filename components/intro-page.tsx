'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// GSAP Plugin бүртгэх
gsap.registerPlugin(ScrollTrigger);

const IntroPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // 1. Lenis Smooth Scroll Setup
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        const ctx = gsap.context(() => {
            // 2. Preloader Animation
            const loadTl = gsap.timeline({
                onComplete: () => {
                    if (loaderRef.current) loaderRef.current.style.display = 'none';
                    initAnimations();
                },
            });

            loadTl
                .to('.loader-bar', { width: '100%', duration: 1.5, ease: 'power2.inOut' })
                .to('.loader-text', { y: -50, opacity: 0, duration: 0.5 })
                .to(loaderRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' });

            const initAnimations = () => {
                // Hero Text Reveal
                gsap.to('.hero-text span', {
                    y: 0,
                    stagger: 0.1,
                    duration: 1.5,
                    ease: 'power4.out',
                });

                // Hero Parallax
                gsap.to('.hero-img', {
                    yPercent: 30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero-img',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });

                // Text Split Animation (Simplified for React)
                const splitElements = document.querySelectorAll('.split-animate');
                splitElements.forEach((el) => {
                    const words = el.querySelectorAll('.word-inner');
                    gsap.to(words, {
                        y: "0%",
                        duration: 1,
                        ease: "power3.out",
                        stagger: 0.02,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    });
                });

                // Card Stacking Effect
                const cards = gsap.utils.toArray<HTMLElement>('.card-item');
                cards.forEach((card, i) => {
                    const nextCard = cards[i + 1];
                    if (nextCard) {
                        gsap.to(card.querySelector('.card-inner'), {
                            scale: 0.9,
                            opacity: 0.4,
                            ease: "none",
                            scrollTrigger: {
                                trigger: nextCard,
                                start: "top bottom",
                                end: "top 10vh",
                                scrub: true,
                            },
                        });
                    }
                });

                // Footer Reveal
                gsap.from('.footer-content', {
                    y: 100,
                    opacity: 0.5,
                    scale: 0.9,
                    scrollTrigger: {
                        trigger: '.footer-sticky',
                        start: 'top bottom',
                        end: 'bottom bottom',
                        scrub: true,
                    },
                });
            };
        }, containerRef);

        return () => {
            ctx.revert();
            lenis.destroy();
        };
    }, []);

    // Туслах функц: Текстүүдийг үг үгээр нь салгах
    const splitText = (text: string) => {
        return text.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top">
                <span className="word-inner inline-block translate-y-[110%]">
                    {word}&nbsp;
                </span>
            </span>
        ));
    };

    return (
        <div ref={containerRef} className="bg-[#E3E1DC] text-[#121212] font-sans selection:bg-[#374336] selection:text-white">
            {/* Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[9000] opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"></div>

            {/* Loader */}
            <div ref={loaderRef} className="fixed inset-0 bg-black z-[10000] flex justify-center items-center text-white">
                <div className="loader-text font-bold text-[5vw] uppercase tracking-tighter">Fundify</div>
                <div className="loader-bar absolute bottom-0 left-0 h-1 bg-white w-0"></div>
            </div>

            <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference text-white uppercase tracking-widest text-xs">
                <div className="font-bold text-xl tracking-tighter">Fundify</div>
                <div className="hidden md:flex gap-10">
                    <a href="#" className="hover:text-gray-300 transition-colors">Work</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Studio</a>
                    <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
                </div>
            </nav>

            <main className="relative z-10 bg-[#E3E1DC] mb-[100vh] shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                {/* Hero Section */}
                <section className="h-screen relative flex items-center justify-center overflow-hidden">
                    <img
                        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/482e7b6a-168c-4d0d-b35d-0e2ff4014577_3840w.webp"
                        className="hero-img absolute inset-0 w-full h-full object-cover brightness-75"
                        alt="Hero"
                    />
                    <div className="relative z-10 text-center text-white mix-blend-difference">
                        <h1 className="hero-text text-[12vw] leading-none font-bold overflow-hidden">
                            <span className="block translate-y-full">SUPPORTING</span>
                        </h1>
                        <h1 className="hero-text text-[12vw] leading-none font-bold overflow-hidden">
                            <span className="block translate-y-full">LIVES</span>
                        </h1>
                    </div>
                </section>

                {/* Intro Section */}
                <section className="py-32 px-6 md:px-20 grid md:grid-cols-2 gap-16 max-w-[1800px] mx-auto">
                    <h2 className="text-4xl md:text-5xl leading-tight split-animate font-bold">
                        {splitText("Compassion as Action.")}
                    </h2>
                    <div className="text-xl font-light leading-relaxed text-gray-700">
                        <p className="mb-8 split-animate">
                            {splitText("We believe generosity can change lives. Fundify connects people with causes that matter.")}
                        </p>
                        <div className="h-px w-full bg-black/10 my-8"></div>
                        <div className="flex gap-12 text-sm uppercase tracking-widest split-animate">
                            <div>{splitText("Est. 2026")}</div>
                            <div>{splitText("Ulaanbaatar / Mongolia")}</div>
                        </div>
                    </div>
                </section>

                {/* Card Stack */}
                <section className="bg-[#121212] text-[#E3E1DC] py-20">
                    <div className="max-w-[1400px] mx-auto relative px-4">
                        {[
                            { id: '01', title: 'Safety & Trust', text: 'Манайх хандивыг бодит өөрчлөлт болгодог.', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80' },
                            { id: '02', title: 'Secure Giving', text: 'Хэрэглэгчид хандив өгөхийг амархан болгосон.', img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80' },
                            { id: '03', title: 'Verified & Safe', text: 'Fundify нь шалгагдсан campaign-уудтай.', img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80' }
                        ].map((card, idx) => (
                            <div key={idx} className="card-item sticky top-[10vh] h-[80vh] flex items-center justify-center mb-[5vh]">
                                <div className="card-inner w-[90%] h-full bg-[#1a1a1a] border border-white/10 grid md:grid-cols-[1fr_1.2fr] overflow-hidden shadow-2xl">
                                    <div className="p-8 md:p-16 flex flex-col justify-between">
                                        <div>
                                            <div className="text-5xl opacity-30 mb-2">{card.id}</div>
                                            <h3 className="text-3xl font-bold">{card.title}</h3>
                                        </div>
                                        <p className="text-gray-400 font-light">{card.text}</p>
                                        <button className="border-b border-white/30 pb-2 w-max text-xs uppercase tracking-widest hover:text-white transition-colors">
                                            View Project
                                        </button>
                                    </div>
                                    <div className="overflow-hidden">
                                        <img src={card.img} className="card-img w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt={card.title} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-40 text-center flex flex-col items-center px-6">
                    <h2 className="text-3xl md:text-5xl mb-8 uppercase font-bold tracking-wide">Энэрэл бол үйлдэл</h2>
                    <p className="max-w-2xl text-gray-600 font-light mb-12">
                        Fundify дээр энэрэл бодит тусламж болон хэрэгжинэ.
                    </p>
                    <div className="h-16 w-px bg-black/20"></div>
                </section>
            </main>

            {/* Footer Reveal */}
            <footer className="footer-sticky fixed bottom-0 left-0 w-full h-screen bg-[#111] text-white flex flex-col justify-center items-center z-0">
                <div className="footer-content relative z-10 text-center px-4 max-w-7xl mx-auto">
                    <div className="text-xs uppercase tracking-[0.3em] mb-8 text-gray-500">Make a difference.</div>
                    <a href="mailto:hello@fundify.com" className="text-[8vw] md:text-[5vw] font-bold leading-none hover:text-gray-400 transition-colors">
                        Donate with Fundify today!
                    </a>
                    <div className="mt-20 text-[10px] text-gray-700">© 2025 Fundify</div>
                </div>
                <img
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1c6b6980-54e4-4d8c-9ff6-e09b844d7b01_3840w.webp"
                    className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
                    alt="footer-bg"
                />
            </footer>
        </div>
    );
};

export default IntroPage;
