import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
// Async function to fetch characters from Supabase
const fetchCharacters = async () => {
    const { data, error } = await supabase.from('characters').select('*').order('created_at', { ascending: true });
    if (error)
        throw new Error(error.message);
    return data;
};
export const CharactersPage = () => {
    const { data: characters, isLoading, isError, error } = useQuery({ queryKey: ['characters'], queryFn: fetchCharacters });
    const floatingElementsRef = useRef(null);
    const textAreaRefs = useRef({});
    const characterSectionRefs = useRef([]);
    // Floating background elements
    useEffect(() => {
        if (floatingElementsRef.current) {
            const container = floatingElementsRef.current;
            for (let i = 0; i < 20; i++) {
                const dot = document.createElement('div');
                dot.className = 'floating-dot';
                dot.style.left = Math.random() * 100 + '%';
                dot.style.top = Math.random() * 100 + '%';
                dot.style.animationDelay = Math.random() * 6 + 's';
                dot.style.animationDuration = (4 + Math.random() * 4) + 's';
                container.appendChild(dot);
            }
        }
    }, []);
    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-50px'
        });
        characterSectionRefs.current.forEach(section => {
            if (section)
                observer.observe(section);
        });
        return () => {
            characterSectionRefs.current.forEach(section => {
                if (section)
                    observer.unobserve(section);
            });
        };
    }, [characters]); // Re-observe if characters data changes
    // Parallax effect for floating elements
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = floatingElementsRef.current?.querySelectorAll('.floating-dot');
            parallaxElements?.forEach((element, index) => {
                const speed = 0.5 + (index % 3) * 0.2;
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    if (isLoading)
        return _jsx("div", { className: "text-center py-8 text-text-light", children: "Loading characters..." });
    if (isError)
        return _jsxs("div", { className: "text-center py-8 text-red-400", children: ["Error loading characters: ", error?.message] });
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: floatingElementsRef, className: "floating-elements" }), _jsx("section", { className: "hero-section", children: _jsxs("div", { children: [_jsx("h1", { className: "hero-title", children: "Meet the Characters" }), _jsx("p", { className: "hero-subtitle", children: "Journey into the world of extraordinary souls" }), _jsx("div", { className: "scroll-indicator", children: _jsx("svg", { width: "24", height: "24", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) }) })] }) }), characters?.map((character, index) => (_jsxs("section", { ref: el => { characterSectionRefs.current[index] = el; }, className: `character-section ${index % 2 === 0 ? '' : ''}`, children: [_jsx("div", { className: "character-silhouette", children: _jsx("div", { className: "silhouette-container", children: character.image_url ? (_jsxs(_Fragment, { children: [_jsx("img", { src: character.image_url, alt: character.name, className: "character-image" }), _jsx("div", { className: "silhouette-overlay", style: { '--mask-image': `url(${character.silhouette_url || character.image_url})` } })] })) : (_jsxs("div", { className: "upload-placeholder", children: [_jsx("div", { className: "upload-icon", children: "\uD83D\uDCF7" }), _jsx("div", { children: "No Image" })] })) }) }), _jsxs("div", { className: "character-info", children: [_jsx("h2", { className: "character-name", children: character.name }), _jsx("p", { className: "character-title", children: character.title }), _jsx("p", { className: "character-description", children: character.description }), _jsx("div", { className: "character-traits", children: character.traits?.map((trait, traitIndex) => (_jsx("span", { className: "trait", children: trait }, traitIndex))) })] })] }, character.id)))] }));
};
//# sourceMappingURL=CharactersPage.js.map