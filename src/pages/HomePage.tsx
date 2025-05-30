import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddHomeIcon from '@mui/icons-material/AddHome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
    },
    logo: {
      fontSize: '3rem',
      color: '#1976d2',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#666',
      maxWidth: '600px',
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      padding: '1rem',
    },
    card: {
      height: '120px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      },
    },
    icon: {
      fontSize: '2.5rem',
      color: '#1976d2',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <AddHomeIcon style={styles.logo} />
        <h1 style={styles.title}>Welcome to Property Lister</h1>
        <p style={styles.subtitle}>
          Your one-stop solution for finding, listing, and managing properties
        </p>
      </div>

      <div style={styles.grid}>
        <div 
          style={styles.card}
          onClick={() => navigate('/search-property')}
        >
          <SearchIcon style={styles.icon} />
          <span style={styles.cardTitle}>Search Properties</span>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate('/my-listed-properties')}
        >
          <AddHomeIcon style={styles.icon} />
          <span style={styles.cardTitle}>My Listed Properties</span>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate('/liked-property')}
        >
          <FavoriteIcon style={styles.icon} />
          <span style={styles.cardTitle}>Liked Properties</span>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate('/property-recommended')}
        >
          <ShareIcon style={styles.icon} />
          <span style={styles.cardTitle}>Recommended Properties</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 