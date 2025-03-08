import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoToTop from '../Utilities/GoToTop';
import { useGetFeaturesQuery } from '../../states/apis/plansApiSlice';
import ChatApp from './Feature Sections/eazzyChat/ChatApp';
import CRMApp from './Feature Sections/eazzyCRM/CRMApp';
import UpcomingFeatures from './Feature Sections/UpcomingFeatures';

// Mapping of featureIDs to their respective section components
const sectionComponents: Record<string, () => React.ReactNode> = {
  'eazzy-chat': ChatApp,
  'eazzy-crm': CRMApp,
  'eazzy-hr': UpcomingFeatures,
  'eazzy-books': UpcomingFeatures,
  'eazzy-manufacturing': UpcomingFeatures,
  'inventory-management': UpcomingFeatures,
  'sales-analytics': UpcomingFeatures,
  'financial-management': UpcomingFeatures,
  'supply-chain-management': UpcomingFeatures,
};

export default function Feature() {
  // Get the featureID from the route parameters
  const params = useParams<{ featureID: string }>();

  // Fetch features data using the Redux Toolkit Query hook
  const { data: allDetails, isLoading: isLoadingFeatures, error: featuresError } = useGetFeaturesQuery({});

  // Find the feature detail based on the featureID
  const detail = useMemo(
    () => allDetails?.find((detail) => detail.featureID === params.featureID),
    [allDetails, params.featureID]
  );

  // Manage scroll state for the GoToTop component
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    const scrollThreshold = window.innerHeight * 0.15;
    setScrolled(window.scrollY > scrollThreshold);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Update the document title when the feature detail is available
  useEffect(() => {
    document.title = `${detail?.title} | eazzyBizz`;
  }, [detail]);

  // Handle loading state
  if (isLoadingFeatures) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (featuresError) {
    return <div>Error loading features</div>;
  }

  // Handle case where feature is not found after data is loaded
  if (!detail) {
    throw new Error('Feature not found');
  }

  // Select the appropriate section component
  const SectionComponent = sectionComponents[detail.featureID] || UpcomingFeatures;

  // Render the section component and GoToTop
  return (
    <>
      {SectionComponent && <SectionComponent />}
      <GoToTop scrolled={scrolled} />
    </>
  );
}