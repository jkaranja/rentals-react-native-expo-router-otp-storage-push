import React, { useEffect, useState } from "react";

const useSubscription = () => {
  const [timeLeft, setTimeLeft] = useState(Infinity);

  // const {
  //   currentData: billing,
  //   isFetching,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetBillingQuery(undefined, {
  //   //pollingInterval: 15000,
  //   //refetchOnFocus: true,
  //   refetchOnMountOrArgChange: true,
  // });

  // useEffect(() => {
  //   if (!billing) return;

  //   const diff = new Date(billing.expiresAt).getTime() - Date.now();

  //   const days = diff > 0 ? diff / 8.64e7 : 0;

  //   setTimeLeft(days);
  // }, [billing]);

  return false;
};

export default useSubscription;
