import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GoToTop from '../Utilities/GoToTop';
import { useGetFeaturesQuery } from '../../states/apis/plansApiSlice';
import ChatApp from './Feature Sections/eazzyChat/ChatApp';
import CRMApp from './Feature Sections/eazzyCRM/CRMApp';
import UpcomingFeatures from './Feature Sections/UpcomingFeatures';
import Loading from '../Utilities/Loading';
import ErrorFetching from '../Utilities/ErrorFetching';
import HRApp from './Feature Sections/eazzyHR/HRApp';

export type ColorSchemeType = {
  bgGrad: string;
  bg: string;
  bgHover: string,
  text: string;
  textHover: string
}

const colorSchemes: Record<string, ColorSchemeType> = {
  'eazzy-chat': {
    bgGrad: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-500',
    text: 'text-blue-500',
    textHover: 'hover:text-blue-500'
  },
  'eazzy-crm': {
    bgGrad: 'bg-gradient-to-r from-emerald-600 to-green-900',
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-emerald-600',
    textHover: 'hover:text-emerald-600'
  },
  'eazzy-hr': {
    bgGrad: 'bg-gradient-to-r from-rose-600 to-rose-800',
    bg: 'bg-rose-600',
    bgHover: 'hover:bg-rose-600',
    text: 'text-rose-600',
    textHover: 'hover:text-rose-600'
  },
}

export type QnAType = {
  question: string;
  answer: string;
}

// Mapping of featureIDs to their respective section components
const sectionComponents: Record<string, React.ReactNode> = {
  'eazzy-chat': <ChatApp colorScheme={colorSchemes['eazzy-chat']} />,
  'eazzy-crm': <CRMApp colorScheme={colorSchemes['eazzy-crm']} />,
  'eazzy-hr': <HRApp colorScheme={colorSchemes['eazzy-hr']} />,
  'eazzy-books': <UpcomingFeatures />,
  'eazzy-manufacturing': <UpcomingFeatures />,
  'inventory-management': <UpcomingFeatures />,
  'sales-analytics': <UpcomingFeatures />,
  'financial-management': <UpcomingFeatures />,
  'supply-chain-management': <UpcomingFeatures />,
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
    return <Loading />
  }

  // Handle error state
  if (featuresError) {
    return <ErrorFetching />
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
      {SectionComponent && SectionComponent}
      <GoToTop scrolled={scrolled} />
    </>
  );
}