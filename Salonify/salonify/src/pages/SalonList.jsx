import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSalons } from '../services/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Spinner from '../components/UI/Spinner';

const SalonList = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSalons = async (page, keyword) => {
    try {
      setLoading(true);
      const data = await getAllSalons(page, keyword);
      if (!data || !data.salons) {
        setSalons([]);
        setTotalPages(1);
        setError('No salon data available. Please try again later.');
      } else {
        setSalons(data.salons || []);
        setTotalPages(data.totalPages || 1);
        // Clear any previous errors if we successfully loaded data
        setError(null);
      }
    } catch (err) {
      setError('Failed to load salons. Please try again later.');
      console.error(err);
      setSalons([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons(page, keyword);
  }, [page, keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchQuery);
    setPage(1);
  };

  const handleKeywordChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {/* Header Banner */}
      <div 
        className="relative bg-cover bg-center py-20 mb-8" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80')`,
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Salon</h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">Discover top-rated salons and book your next appointment with ease</p>
          
          {/* Search Form in Banner */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow relative">
                <Input
                  placeholder="Search by salon name or location..."
                  value={searchQuery}
                  onChange={handleKeywordChange}
                  className="pl-10 mb-0 py-3"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
                className="px-8 py-3"
              >
                {loading ? <Spinner size="sm" color="white" className="mr-2" /> : null}
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title and Filters */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              {keyword ? `Search Results for "${keyword}"` : 'All Salons'}
            </h2>
            <p className="text-gray-500">
              {salons.length > 0 ? `Found ${salons.length} salon${salons.length !== 1 ? 's' : ''}` : 'No salons found'}
            </p>
          </div>
          {keyword && (
            <Button 
              variant="secondary" 
              onClick={() => {
                setKeyword('');
                setSearchQuery('');
              }}
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Search
            </Button>
          )}
        </div>

        {/* Salons Grid */}
        {error ? (
          <div className="text-center text-red-600 my-8 bg-red-50 p-6 rounded-lg">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        ) : loading && page === 1 ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {salons.length > 0 ? (
                salons.map((salon) => (
                  <div
                    key={salon._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={salon.images && salon.images[0] || "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                        alt={salon.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 font-medium text-gray-700">{salon.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{salon.name}</h3>
                      <div className="flex items-center text-gray-500 mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="truncate">{salon.address}</p>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                        {salon.description || "Experience exceptional beauty services at our premier salon."}
                      </p>
                      
                      <div className="border-t border-gray-100 pt-4 mb-4">
                        <div className="flex flex-col space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-14 0 9 9 0 0114 0z" />
                            </svg>
                            <span className="font-medium mr-1">Hours:</span>
                            <span>{salon.opening_time} - {salon.closing_time}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-medium mr-1">Phone:</span>
                            <span>{salon.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">Hair</span>
                        <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">Nails</span>
                        <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">Makeup</span>
                      </div>
                      
                      <Link to={salon._id ? `/salons/${salon._id}` : '#'} className="block">
                        <Button variant="primary" fullWidth>
                          {salon._id ? 'View Salon' : 'Salon Details'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="max-w-lg mx-auto">
                    <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">No salons found</h3>
                    <p className="text-gray-600 text-lg mb-2">
                      {keyword ? `We couldn't find any salons matching "${keyword}".` : "No salons are available at the moment."}
                    </p>
                    <p className="text-gray-500 mb-6">
                      {keyword ? "Try adjusting your search terms or browse all available salons." : "Please check back later or try a different search."}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {keyword && (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setKeyword('');
                            setSearchQuery('');
                          }}
                          className="px-6"
                        >
                          View All Salons
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSearchQuery('');
                          document.querySelector('input[placeholder*="Search"]').focus();
                        }}
                        className="px-6 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Try Different Search
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {salons.length > 0 && totalPages > 1 && (
              <div className="mt-12 mb-8">
                <div className="flex justify-center">
                  <nav className="flex items-center bg-white px-4 py-3 rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`mx-1 flex items-center px-3 py-2 rounded-md ${
                        page === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex mx-2">
                      {[...Array(totalPages).keys()].map((x) => {
                        const pageNumber = x + 1;
                        // Show current page, first and last pages, and one page before and after current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= page - 1 && pageNumber <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`mx-1 w-10 h-10 flex items-center justify-center rounded-full ${
                                pageNumber === page
                                  ? 'bg-primary-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          (pageNumber === page - 2 && page > 3) ||
                          (pageNumber === page + 2 && page < totalPages - 2)
                        ) {
                          return (
                            <span key={pageNumber} className="mx-1 w-10 h-10 flex items-center justify-center">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`mx-1 flex items-center px-3 py-2 rounded-md ${
                        page === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </nav>
                </div>
                <div className="text-center mt-4 text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalonList; 