import React, { useState, useEffect, useRef } from 'react';
// Removed: import styles from '../styles/ArtistCollaboration.module.css';

const ArtistCollaborationPage: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const textAreaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

    const [formData, setFormData] = useState<Record<string, any>>({
        fullName: '',
        preferredName: '',
        email: '',
        timezone: '',
        country: '',
        portfolioLinks: '',
        specialties: [],
        tools: [],
        availability: '',
        startDate: '',
        commitment: '',
        bestPieces: '',
        makingOfNotes: '',
        visualInfluences: '',
        worldVisualization: '',
        feedbackProcess: '',
        colorGrading: '',
        references: '',
        turnaround: '',
        revisionPolicy: '',
        revenueShareWilling: '',
        preferredTrack: '',
        taxConstraints: '',
        projectPortal: false,
        ndaAcceptance: false,
        originalityConfirm: false,
        rightsConfirm: false,
        signature: '',
        signatureDate: new Date().toISOString().split('T')[0],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        if (type === 'checkbox') {
            setFormData(prev => {
                const currentValues = prev[name] || [];
                if (checked) {
                    return { ...prev, [name]: [...currentValues, value] };
                } else {
                    return { ...prev, [name]: currentValues.filter((item: string) => item !== value) };
                }
            });
        } else if (type === 'radio') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, inputName: string) => {
        const files = e.target.files;
        setFormData(prev => ({ ...prev, [inputName]: files }));
        updateFileUploadDisplay(e.target, inputName);
    };

    const updateFileUploadDisplay = (inputElement: HTMLInputElement, inputName: string) => {
        const container = inputElement.closest(`.file-upload`) as HTMLElement; // Changed from styles['file-upload']
        if (!container) return;

        const fileCount = inputElement.files ? inputElement.files.length : 0;
        const textElement = container.querySelector('p');

        if (textElement) {
            if (fileCount > 0) {
                textElement.innerHTML = `${fileCount} file(s) selected<br><small>Ready to upload</small>`;
                container.style.backgroundColor = '#e8f5e8'; // Inline style for background
            } else {
                textElement.innerHTML = 'Drop files here or click to browse<br><small>JPG/PNG, max 5MB per file</small>';
                container.style.backgroundColor = 'white'; // Inline style for background
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f8ff'; // Inline style for background
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.backgroundColor = 'white'; // Inline style for background
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, inputName: string) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.backgroundColor = '#e8f5e8'; // Inline style for background
        const files = e.dataTransfer.files;
        if (fileInputRefs.current[inputName]) {
            (fileInputRefs.current[inputName] as HTMLInputElement).files = files;
            setFormData(prev => ({ ...prev, [inputName]: files }));
            updateFileUploadDisplay(fileInputRefs.current[inputName] as HTMLInputElement, inputName);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, you would send formData to your backend
        console.log('Application data:', formData);
        alert('Thank you for your application! We\'ll review your submission and get back to you within 1-2 weeks.');
    };

    // Effect for dynamic form sections (revenue share)
    useEffect(() => {
        const trackSelectGroup = document.getElementById('preferredTrack')?.closest(`.form-group`); // Changed from styles['form-group']
        if (trackSelectGroup) {
            if (formData.revenueShareWilling === 'yes') {
                trackSelectGroup.style.display = 'block';
                document.getElementById('preferredTrack')?.setAttribute('required', 'required');
            } else {
                trackSelectGroup.style.display = 'none';
                document.getElementById('preferredTrack')?.removeAttribute('required');
                setFormData(prev => ({ ...prev, preferredTrack: '' })); // Clear value if hidden
            }
        }
    }, [formData.revenueShareWilling]);

    // Effect for character counters
    useEffect(() => {
        Object.entries(textAreaRefs.current).forEach(([name, textarea]) => {
            if (textarea) {
                const maxLength = parseInt(textarea.getAttribute('data-maxlength') || '1000');
                let counter = textarea.nextElementSibling as HTMLElement;

                if (!counter || !counter.classList.contains('char-counter')) {
                    counter = document.createElement('small');
                    counter.classList.add('char-counter');
                    counter.style.display = 'block';
                    counter.style.textAlign = 'right';
                    counter.style.color = 'var(--muted-foreground)'; // Using CSS variable
                    counter.style.marginTop = '0.25rem';
                    textarea.parentNode?.insertBefore(counter, textarea.nextSibling);
                }

                const updateCounter = () => {
                    const currentLength = textarea.value.length;
                    counter.textContent = `${currentLength}/${maxLength} characters`;

                    if (currentLength > maxLength * 0.9) {
                        counter.style.color = 'var(--destructive)'; // Using CSS variable
                    } else if (currentLength > maxLength * 0.7) {
                        counter.style.color = 'var(--accent)'; // Using CSS variable
                    } else {
                        counter.style.color = 'var(--muted-foreground)'; // Using CSS variable
                    }
                };

                textarea.addEventListener('input', updateCounter);
                updateCounter(); // Initial update

                return () => {
                    textarea.removeEventListener('input', updateCounter);
                };
            }
        });
    }, [formData]); // Re-run if formData changes to ensure counters are updated

    // Effect for progress indicator
    useEffect(() => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--border); /* Using CSS variable */
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%); /* Using CSS variables */
            width: 0%;
            transition: width 0.3s ease;
        `;

        progressBar.appendChild(progressFill);
        document.body.prepend(progressBar);

        const updateProgress = () => {
            if (!formRef.current) return;
            const requiredFields = Array.from(formRef.current.querySelectorAll('[required]')) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
            const filledFields = requiredFields.filter(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    return (field as HTMLInputElement).checked;
                }
                return field.value.trim() !== '';
            }).length;
            const totalRequiredFields = requiredFields.length;
            const progress = totalRequiredFields > 0 ? (filledFields / totalRequiredFields) * 100 : 0;
            progressFill.style.width = `${progress}%`;
        };

        // Attach event listeners to all form elements for progress update
        const formElements = formRef.current?.querySelectorAll('input, select, textarea');
        formElements?.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });

        updateProgress(); // Initial update

        return () => {
            progressBar.remove();
            formElements?.forEach(field => {
                field.removeEventListener('input', updateProgress);
                field.removeEventListener('change', updateProgress);
            });
        };
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

    return (
        <div className="max-w-7xl mx-auto bg-card shadow-lg rounded-xl overflow-hidden my-8"> {/* Converted .container */} 
            <div className="relative p-12 text-center text-white bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden"> {/* Converted .header */} 
                <div className="absolute inset-0" style={{ /* Converted .header::before */
                    background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.08)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat`,
                    opacity: 0.3
                }}></div>
                <h1 className="text-4xl font-bold mb-2 relative z-10">Artist Collaboration Program</h1> {/* Converted .header h1 */} 
                <p className="text-lg opacity-90 relative z-10">Shape the visual identity of the Zangar/Spandam Series</p> {/* Converted .header p */} 
            </div>

            <div className="p-12"> {/* Converted .content */} 
                <div className="bg-background p-8 rounded-lg mb-12 border-l-4 border-primary"> {/* Converted .intro */} 
                    <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Creative Vision</h2> {/* Converted .intro h2 */} 
                    <p className="text-lg mb-4">We're seeking <strong>1-2 talented artists</strong> to collaborate on bringing to life a world of cliffside megacities, sky-splitting space elevators, and civilizations locked in "soft war." This is a unique revenue-share collaboration opportunity where your creative vision helps shape an entire series.</p> {/* Converted .intro p */} 
                    <p className="text-lg mb-4">No upfront payment required - you'll earn meaningful percentages of book revenue with transparent reporting and fair compensation structures designed to reward your contribution over time.</p> {/* Converted .intro p */} 
                </div>

                <div className="bg-gradient-to-br from-primary to-accent text-white p-6 rounded-lg my-8"> {/* Converted .highlight-box */} 
                    <h3 className="text-2xl font-bold mb-4">What We're Looking For</h3> {/* Converted .highlight-box h3 */} 
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8"> {/* Converted .info-grid */} 
                        <div className="bg-card p-6 rounded-lg border-l-4 border-primary text-foreground"> {/* Converted .info-card */} 
                            <h4 className="text-xl font-semibold mb-2">Cover Art</h4> {/* Converted .info-card h4 */} 
                            <p>Stunning key art that captures the epic scope and Persian/Zoroastrian-influenced aesthetic of our megastructures</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border-l-4 border-primary text-foreground">
                            <h4 className="text-xl font-semibold mb-2">Interior Illustrations</h4>
                            <p>6-12 atmospheric pieces that enhance key scenes and world-building moments</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border-l-4 border-primary text-foreground">
                            <h4 className="text-xl font-semibold mb-2">World Design</h4>
                            <p>Clan sigils, glyphs, UI ornaments, and visual motifs that define our world's identity</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border-l-4 border-primary text-foreground">
                            <h4 className="text-xl font-semibold mb-2">Marketing Assets</h4>
                            <p>Website heroes, social banners, and promotional materials that drive engagement</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-4">Fair Compensation Structure</h2>
                <p className="text-lg mb-4">Choose the track that works best for your situation:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"> {/* Converted .compensation-grid */} 
                    <div className="bg-card border-2 border-border rounded-lg p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-primary"> {/* Converted .compensation-card */} 
                        <h4 className="text-xl font-semibold text-primary mb-4">Track A: Higher Percentage, Shorter Term</h4> {/* Converted .compensation-card h4 */} 
                        <ul className="list-disc list-inside text-foreground">
                            <li><strong>Primary Cover:</strong> 5% net revenue for 12 months (cap: $7,500)</li>
                            <li><strong>Secondary/Marketing Art:</strong> 2.5% for 12 months (cap: $3,500)</li>
                            <li><strong>Interior Pack (6-12 images):</strong> 1.5% for 12 months (cap: $2,000)</li>
                            <li><strong>Motifs/UI Package:</strong> 1.0% for 12 months (cap: $1,200)</li>
                        </ul>
                    </div>
                    <div className="bg-card border-2 border-border rounded-lg p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-primary">
                        <h4 className="text-xl font-semibold text-primary mb-4">Track B: Lower Percentage, Longer Term</h4>
                        <ul className="list-disc list-inside text-foreground">
                            <li><strong>Primary Cover:</strong> 3% net revenue for 24 months (cap: $7,500)</li>
                            <li><strong>Secondary/Marketing Art:</strong> 1.5% for 24 months (cap: $3,500)</li>
                            <li><strong>Interior Pack:</strong> 1.0% for 24 months (cap: $2,000)</li>
                            <li><strong>Motifs/UI:</strong> 0.75% for 24 months (cap: $1,200)</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-accent text-white p-6 rounded-lg my-8"> {/* Converted .highlight-box */} 
                    <h3 className="text-2xl font-bold mb-4">Transparency & Trust</h3>
                    <p className="mb-2"><strong>Quarterly financial statements</strong> with itemized revenue calculations</p>
                    <p className="mb-2"><strong>Payment within 30 days</strong> of each quarter end</p>
                    <p className="mb-2"><strong>Right to audit</strong> statements once per year</p>
                    <p><strong>Milestone bonuses</strong> if the book crosses $50,000 in net revenue</p>
                </div>

                <div className="bg-background p-8 rounded-lg mt-12"> {/* Converted .form-container */} 
                    <h2 className="text-2xl font-bold text-foreground mb-4">Application Form</h2>
                    <form ref={formRef} onSubmit={handleSubmit}>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0"> {/* Converted .form-section */} 
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Identity & Contact
                            </h3> {/* Converted .form-section h3 and ::before */} 
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Converted .form-row */} 
                                <div className="mb-4"> {/* Converted .form-group */} 
                                    <label htmlFor="fullName" className="block mb-2 font-semibold text-muted-foreground">Full Name<span className="text-destructive"> *</span></label> {/* Converted label and .required::after */} 
                                    <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" /> {/* Converted input */} 
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="preferredName" className="block mb-2 font-semibold text-muted-foreground">Preferred Name/Alias</label>
                                    <input type="text" id="preferredName" name="preferredName" value={formData.preferredName} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2 font-semibold text-muted-foreground">Email<span className="text-destructive"> *</span></label>
                                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="timezone" className="block mb-2 font-semibold text-muted-foreground">Time Zone<span className="text-destructive"> *</span></label>
                                    <select id="timezone" name="timezone" required value={formData.timezone} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50">
                                        <option value="">Select your timezone</option>
                                        <option value="UTC-12">UTC-12 (Baker Island)</option>
                                        <option value="UTC-11">UTC-11 (Hawaii)</option>
                                        <option value="UTC-10">UTC-10 (Alaska)</option>
                                        <option value="UTC-9">UTC-9 (Pacific)</option>
                                        <option value="UTC-8">UTC-8 (Mountain)</option>
                                        <option value="UTC-7">UTC-7 (Central)</option>
                                        <option value="UTC-6">UTC-6 (Eastern)</option>
                                        <option value="UTC-5">UTC-5 (Atlantic)</option>
                                        <option value="UTC+0">UTC+0 (London)</option>
                                        <option value="UTC+1">UTC+1 (Central Europe)</option>
                                        <option value="UTC+2">UTC+2 (Eastern Europe)</option>
                                        <option value="UTC+8">UTC+8 (China/Singapore)</option>
                                        <option value="UTC+9">UTC+9 (Japan)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="country" className="block mb-2 font-semibold text-muted-foreground">Country<span className="text-destructive"> *</span></label>
                                <input type="text" id="country" name="country" required value={formData.country} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="portfolioLinks" className="block mb-2 font-semibold text-muted-foreground">Portfolio Links<span className="text-destructive"> *</span></label>
                                <textarea id="portfolioLinks" name="portfolioLinks" placeholder="Please provide links to your portfolio (ArtStation, Behance, personal website, Instagram, etc.)" required value={formData.portfolioLinks} onChange={handleInputChange} ref={el => { textAreaRefs.current['portfolioLinks'] = el; }} data-maxlength="500" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0">
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Art Focus & Availability
                            </h3>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">Primary Specialties (check all that apply)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"> {/* Converted .checkbox-group */} 
                                    <div className="flex items-center"> {/* Converted .checkbox-item */} 
                                        <input type="checkbox" id="coverIll" name="specialties" value="cover-illustration" onChange={handleInputChange} checked={formData.specialties.includes('cover-illustration')} className="w-auto mr-2" /> {/* Converted input[type="checkbox"] */} 
                                        <label htmlFor="coverIll">Cover Illustration</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="charDesign" name="specialties" value="character-design" onChange={handleInputChange} checked={formData.specialties.includes('character-design')} className="w-auto mr-2" />
                                        <label htmlFor="charDesign">Character Design</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="environment" name="specialties" value="environment" onChange={handleInputChange} checked={formData.specialties.includes('environment')} className="w-auto mr-2" />
                                        <label htmlFor="environment">Environment Art</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="uiMotifs" name="specialties" value="ui-motifs" onChange={handleInputChange} checked={formData.specialties.includes('ui-motifs')} className="w-auto mr-2" />
                                        <label htmlFor="uiMotifs">UI/Sigil Design</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="typography" name="specialties" value="typography" onChange={handleInputChange} checked={formData.specialties.includes('typography')} className="w-auto mr-2" />
                                        <label htmlFor="typography">Typography</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="marketing" name="specialties" value="marketing" onChange={handleInputChange} checked={formData.specialties.includes('marketing')} className="w-auto mr-2" />
                                        <label htmlFor="marketing">Marketing Visuals</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">Tools/Software (check all that apply)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="photoshop" name="tools" value="photoshop" onChange={handleInputChange} checked={formData.tools.includes('photoshop')} className="w-auto mr-2" />
                                        <label htmlFor="photoshop">Photoshop</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="procreate" name="tools" value="procreate" onChange={handleInputChange} checked={formData.tools.includes('procreate')} className="w-auto mr-2" />
                                        <label htmlFor="procreate">Procreate</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="clipstudio" name="tools" value="clip-studio" onChange={handleInputChange} checked={formData.tools.includes('clip-studio')} className="w-auto mr-2" />
                                        <label htmlFor="clipstudio">Clip Studio</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="blender" name="tools" value="blender" onChange={handleInputChange} checked={formData.tools.includes('blender')} className="w-auto mr-2" />
                                        <label htmlFor="blender">Blender</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="illustrator" name="tools" value="illustrator" onChange={handleInputChange} checked={formData.tools.includes('illustrator')} className="w-auto mr-2" />
                                        <label htmlFor="illustrator">Illustrator</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="other" name="tools" value="other" onChange={handleInputChange} checked={formData.tools.includes('other')} className="w-auto mr-2" />
                                        <label htmlFor="other">Other</label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="availability" className="block mb-2 font-semibold text-muted-foreground">Weekly Availability<span className="text-destructive"> *</span></label>
                                    <select id="availability" name="availability" required value={formData.availability} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50">
                                        <option value="">Select availability</option>
                                        <option value="10-15">10-15 hours/week</option>
                                        <option value="15-25">15-25 hours/week</option>
                                        <option value="25+">25+ hours/week</option>
                                        <option value="project-sprints">Project-only sprints</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="startDate" className="block mb-2 font-semibold text-muted-foreground">Earliest Start Date<span className="text-destructive"> *</span></label>
                                    <input type="date" id="startDate" name="startDate" required value={formData.startDate} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="commitment" className="block mb-2 font-semibold text-muted-foreground">Time Commitment Window</label>
                                <input type="text" id="commitment" name="commitment" placeholder="e.g., 'I can commit for 3 months' or 'Available through Q2 2025'" value={formData.commitment} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0">
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Portfolio & Samples
                            </h3>
                            <div className="mb-4">
                                <label htmlFor="portfolioUpload" className="block mb-2 font-semibold text-muted-foreground">Portfolio Upload (3-6 images, optional)</label>
                                <div className="file-upload border-2 border-dashed border-primary rounded-lg p-8 text-center bg-card transition-colors duration-300 ease-in-out hover:bg-blue-50" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'portfolioUpload')}> {/* Converted .file-upload */} 
                                    <input type="file" id="portfolioUpload" name="portfolioUpload" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'portfolioUpload')} ref={el => { fileInputRefs.current['portfolioUpload'] = el; }} className="hidden" /> {/* Hidden input */} 
                                    <p className="text-muted-foreground">Drop files here or <span className="text-primary cursor-pointer" onClick={() => fileInputRefs.current['portfolioUpload']?.click()}>click to browse</span><br /><small>JPG/PNG, max 5MB per file</small></p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bestPieces" className="block mb-2 font-semibold text-muted-foreground">Direct Links to 3-5 Best Pieces<span className="text-destructive"> *</span></label>
                                <textarea id="bestPieces" name="bestPieces" placeholder="Please provide direct links to your best work that showcases your style and skill" required value={formData.bestPieces} onChange={handleInputChange} ref={el => { textAreaRefs.current['bestPieces'] = el; }} data-maxlength="500" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="customSample" className="block mb-2 font-semibold text-muted-foreground">Custom Sample for This Project (optional)</label>
                                <div className="file-upload border-2 border-dashed border-primary rounded-lg p-8 text-center bg-card transition-colors duration-300 ease-in-out hover:bg-blue-50">
                                    <input type="file" id="customSample" name="customSample" accept="image/*" onChange={(e) => handleFileChange(e, 'customSample')} ref={el => { fileInputRefs.current['customSample'] = el; }} className="hidden" />
                                    <p className="text-muted-foreground">Upload a custom piece based on our world concept<br /><small>Not required but highly encouraged</small></p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="makingOfNotes" className="block mb-2 font-semibold text-muted-foreground">Brief Making-of Notes (optional)</label>
                                <textarea id="makingOfNotes" name="makingOfNotes" placeholder="Describe your approach, tools, or references used (50-150 words)" value={formData.makingOfNotes} onChange={handleInputChange} ref={el => { textAreaRefs.current['makingOfNotes'] = el; }} data-maxlength="150" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0">
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Style & Fit Questions
                            </h3>
                            <div className="mb-4">
                                <label htmlFor="visualInfluences" className="block mb-2 font-semibold text-muted-foreground">Visual Influences for This Project<span className="text-destructive"> *</span></label>
                                <textarea id="visualInfluences" name="visualInfluences" placeholder="What visual influences, artists, or styles do you think overlap with this Persian/Zoroastrian-influenced sci-fi world? (100-200 words)" required value={formData.visualInfluences} onChange={handleInputChange} ref={el => { textAreaRefs.current['visualInfluences'] = el; }} data-maxlength="200" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="worldVisualization" className="block mb-2 font-semibold text-muted-foreground">World Visualization<span className="text-destructive"> *</span></label>
                                <textarea id="worldVisualization" name="worldVisualization" placeholder="Describe how you'd visualize: cliffside megacity Vənāsō, space elevator, 'soft war' sky, oath-bound warrior (Hooran) (150-250 words)" required value={formData.worldVisualization} onChange={handleInputChange} ref={el => { textAreaRefs.current['worldVisualization'] = el; }} data-maxlength="250" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="feedbackProcess" className="block mb-2 font-semibold text-muted-foreground">Feedback & Revision Process<span className="text-destructive"> *</span></label>
                                <textarea id="feedbackProcess" name="feedbackProcess" placeholder="How do you handle feedback and revisions? What's your typical process? (100-200 words)" required value={formData.feedbackProcess} onChange={handleInputChange} ref={el => { textAreaRefs.current['feedbackProcess'] = el; }} data-maxlength="200" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="colorGrading" className="block mb-2 font-semibold text-muted-foreground">Preferred Color Grading</label>
                                <input type="text" id="colorGrading" name="colorGrading" placeholder="e.g., 'Cool teals/slates with warm amber accents' or 'Muted earth tones with electric blues'" value={formData.colorGrading} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0">
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Process & Reliability
                            </h3>
                            <div className="mb-4">
                                <label htmlFor="references" className="block mb-2 font-semibold text-muted-foreground">Past Client References or Shipped Work</label>
                                <textarea id="references" name="references" placeholder="Links to published work, client testimonials, or references (optional)" value={formData.references} onChange={handleInputChange} ref={el => { textAreaRefs.current['references'] = el; }} data-maxlength="500" className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="turnaround" className="block mb-2 font-semibold text-muted-foreground">Typical Turnaround for Single Finished Piece<span className="text-destructive"> *</span></label>
                                <select id="turnaround" name="turnaround" required value={formData.turnaround} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50">
                                    <option value="">Select timeframe</option>
                                    <option value="3-5-days">3-5 days</option>
                                    <option value="1-2-weeks">1-2 weeks</option>
                                    <option value="2-4-weeks">2-4 weeks</option>
                                    <option value=">4-weeks">More than 4 weeks</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="revisionPolicy" className="block mb-2 font-semibold text-muted-foreground">Revision Policy<span className="text-destructive"> *</span></label>
                                <input type="text" id="revisionPolicy" name="revisionPolicy" placeholder="e.g., '2 rounds of revisions included, additional rounds at hourly rate'" required value={formData.revisionPolicy} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0">
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Compensation Preferences
                            </h3>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">
                                    <input type="radio" name="revenueShareWilling" value="yes" required onChange={handleInputChange} checked={formData.revenueShareWilling === 'yes'} className="w-auto mr-2" />
                                    Yes, I'm willing to work for revenue share until sales begin
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">
                                    <input type="radio" name="revenueShareWilling" value="no" required onChange={handleInputChange} checked={formData.revenueShareWilling === 'no'} className="w-auto mr-2" />
                                    No, I prefer upfront payment
                                </label>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="preferredTrack" className="block mb-2 font-semibold text-muted-foreground">If yes to revenue share, preferred track:</label>
                                <select id="preferredTrack" name="preferredTrack" value={formData.preferredTrack} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50">
                                    <option value="">Select preferred track</option>
                                    <option value="track-a">Track A: Higher percentage, 12 months</option>
                                    <option value="track-b">Track B: Lower percentage, 24 months</option>
                                    <option value="flexible">Flexible/Open to discussion</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="taxConstraints" className="block mb-2 font-semibold text-muted-foreground">Tax or Invoicing Constraints</label>
                                <input type="text" id="taxConstraints" name="taxConstraints" placeholder="Any specific requirements for your country/region? (optional)" value={formData.taxConstraints} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                            </div>
                        </div>

                        <div className="mb-8 pb-8 border-b border-border last:border-b-0">
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                                <span className="w-1 h-5 bg-primary mr-2.5 rounded-sm"></span>Legal & Agreements
                            </h3>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">
                                    <input type="checkbox" name="projectPortal" required onChange={handleInputChange} checked={formData.projectPortal} className="w-auto mr-2" />
                                    I consent to using the project portal/workflow system
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">
                                    <input type="checkbox" name="ndaAcceptance" required onChange={handleInputChange} checked={formData.ndaAcceptance} className="w-auto mr-2" />
                                    I accept NDA/Confidentiality requirements
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">
                                    <input type="checkbox" name="originalityConfirm" required onChange={handleInputChange} checked={formData.originalityConfirm} className="w-auto mr-2" />
                                    I confirm originality of my work and ability to grant licensing rights
                                </label>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold text-muted-foreground">
                                    <input type="checkbox" name="rightsConfirm" required onChange={handleInputChange} checked={formData.rightsConfirm} className="w-auto mr-2" />
                                    I confirm my ability to grant project-specific rights as outlined
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="signature" className="block mb-2 font-semibold text-muted-foreground">Digital Signature<span className="text-destructive"> *</span></label>
                                    <input type="text" id="signature" name="signature" placeholder="Type your full name" required value={formData.signature} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="signatureDate" className="block mb-2 font-semibold text-muted-foreground">Date<span className="text-destructive"> *</span></label>
                                    <input type="date" id="signatureDate" name="signatureDate" required value={formData.signatureDate} onChange={handleInputChange} className="w-full p-3 border-2 border-input rounded-md text-base transition-colors duration-300 ease-in-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 px-8 bg-gradient-to-br from-primary to-accent text-white font-semibold text-lg rounded-lg border-none cursor-pointer transition-all duration-300 ease-in-out mt-8 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/50">Apply to Collaborate</button> {/* Converted .submit-btn */} 
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArtistCollaborationPage;