import React from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationForm = () => {
  const navigate = useNavigate();

  // Placeholder data for dropdowns - in a real app, this would come from a config or API
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'];
  const timezones = ['PST', 'MST', 'CST', 'EST', 'GMT', 'Other'];
  const genres = ['Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance', 'Horror'];
  const strengths = ['Plot', 'Pacing', 'Character', 'Continuity', 'Clarity', 'Worldbuilding'];

  const renderField = (label: string, input: React.ReactNode, required = false) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {input}
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Beta application submitted!');
    localStorage.setItem('betaApplicationStatus', 'pending');
    navigate('/beta/status'); // Redirect to application status page
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {/* Section 1: Basics */}
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Basics</h2>
      {renderField('Full Name', <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text" />, true)}
      {renderField('Email', <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="email" />, true)}
      {renderField('Country', <select className="shadow border rounded w-full py-2 px-3 text-gray-700"><option>Select a country</option>{countries.map(c => <option key={c}>{c}</option>)}</select>, true)}
      {renderField('Timezone', <select className="shadow border rounded w-full py-2 px-3 text-gray-700"><option>Select a timezone</option>{timezones.map(t => <option key={t}>{t}</option>)}</select>, true)}
      {renderField('Reading Speed (per week)', <select className="shadow border rounded w-full py-2 px-3 text-gray-700"><option>Select reading speed</option><option>&lt;2h/wk</option><option>2-4h/wk</option><option>5-7h/wk</option><option>8h+</option></select>, true)}

      {/* Section 2: Experience */}
      <h2 className="text-2xl font-bold mb-6 mt-8 border-b pb-2">Experience</h2>
      {renderField('Past Beta Reading Experience (optional)', <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows={4} />)}
      {renderField('Favorite Genres', <div className="grid grid-cols-2 gap-2">{genres.map(g => <label key={g} className="flex items-center"><input type="checkbox" className="mr-2" />{g}</label>)}</div>, true)}
      {renderField('Your Strengths as a Reader', <div className="grid grid-cols-2 gap-2">{strengths.map(s => <label key={s} className="flex items-center"><input type="checkbox" className="mr-2" />{s}</label>)}</div>, true)}

      {/* Section 3: Availability & Devices */}
      <h2 className="text-2xl font-bold mb-6 mt-8 border-b pb-2">Availability & Devices</h2>
      {renderField('How many hours can you commit per week?', <select className="shadow border rounded w-full py-2 px-3 text-gray-700"><option>Select hours</option><option>2-3h</option><option>4-6h</option><option>7-10h</option><option>10h+</option></select>, true)}
      {renderField('Preferred Ebook Formats', <div className="flex space-x-4"><label><input type="checkbox" className="mr-2" />EPUB</label><label><input type="checkbox" className="mr-2" />PDF</label></div>, true)}
      {renderField('Primary Reading Device (optional)', <select className="shadow border rounded w-full py-2 px-3 text-gray-700"><option>Select a device</option><option>eReader</option><option>Tablet</option><option>Phone</option><option>Desktop</option></select>)}

      {/* Section 4: Sample Feedback Task */}
      <h2 className="text-2xl font-bold mb-6 mt-8 border-b pb-2">Sample Feedback Task</h2>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-bold mb-2">Excerpt:</p>
        <p className="italic">The obsidian gates groaned, not with the weight of stone, but with the sorrow of ages. Kaelen watched from the shadows, his breath a ghost in the frigid air, as the sigil on the archway pulsed with a faint, sickly green light. It was a warning. It was an invitation.</p>
      </div>
      {renderField('What worked best in this excerpt and why? (100-300 words)', <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows={5} />, true)}
      {renderField('What, if anything, was confusing or unclear? How could it be improved? (100-300 words)', <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows={5} />, true)}
      {renderField('Provide one actionable suggestion to enhance this scene. (60-200 words)', <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" rows={3} />, true)}

      {/* Section 5: Consents */}
      <h2 className="text-2xl font-bold mb-6 mt-8 border-b pb-2">Consents</h2>
      {renderField('', <label className="flex items-center"><input type="checkbox" className="mr-2" /> I agree to receive watermarked files and understand they are for my personal use only.</label>, true)}
      {renderField('', <label className="flex items-center"><input type="checkbox" className="mr-2" /> I agree to sign a Non-Disclosure Agreement (NDA) if I am selected for the program.</label>, true)}
      {renderField('', <label className="flex items-center"><input type="checkbox" className="mr-2" /> (Optional) I agree to share anonymized device logs to help with quality assurance.</label>, false)}

      <div className="flex items-center justify-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Submit Application
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;