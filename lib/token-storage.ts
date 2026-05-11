export interface TokenData {
  totalToken: number;
  soldToken: number;
  updatedAt: string;
}

const TOKEN_STORAGE_KEY = 'rentx_token_data';

// Get default token data
const getDefaultTokenData = (): TokenData => ({
  totalToken: 560000000, // 560M tokens
  soldToken: 252000000, // 45% of total
  updatedAt: new Date().toISOString(),
});

// Initialize token data if it doesn't exist
export const initializeTokenData = async (): Promise<TokenData> => {
  try {
    if (typeof window === 'undefined') return getDefaultTokenData();
    const existing = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!existing) {
      const defaultData = getDefaultTokenData();
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(existing) as TokenData;
  } catch (error) {
    console.error('Error initializing token data:', error);
    return getDefaultTokenData();
  }
};

// Get current token data
export const getTokenData = async (): Promise<TokenData | null> => {
  try {
    if (typeof window === 'undefined') return getDefaultTokenData();
    const data = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as TokenData;
    }
    // Initialize if doesn't exist
    return await initializeTokenData();
  } catch (error) {
    console.error('Error fetching token data:', error);
    return getDefaultTokenData();
  }
};

// Update token data
export const updateTokenData = async (
  soldToken: number,
  totalToken: number
): Promise<TokenData> => {
  try {
    const updatedData: TokenData = {
      totalToken,
      soldToken,
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(updatedData));
    }
    return updatedData;
  } catch (error) {
    console.error('Error updating token data:', error);
    return { totalToken, soldToken, updatedAt: new Date().toISOString() };
  }
};

// Calculate percentage sold
export const calculatePercentageSold = (data: TokenData): number => {
  if (data.totalToken === 0) return 0;
  return Math.round((data.soldToken / data.totalToken) * 100);
};
