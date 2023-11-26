import { useQuery, } from "@tanstack/react-query"
import { useState, useEffect } from "react";
// implements custom hooks with tanstack query for asynchronous state management of Tableau
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useRestAuth = async () => {
  const tableau = {
    url: 'https://us-west-2a.online.tableau.com',
    site: 'pulseinternal',
    apiVersion: '3.18',
    pat: {
        name: 'takashi-test',
        secret: 'D7f8iW1HSkCDqS7mxA6ENA==:7AOE2FwChb2TwMxx7WKWTulafY4uspOh'
    }
  }

  async function tableauAuth() {
    const url = `${tableau.url}/api/${tableau.apiVersion}/auth/signin`;
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            "credentials": {
                "personalAccessTokenName": tableau.pat.name,
                "personalAccessTokenSecret": tableau.pat.secret,
                "site": {
                    "contentUrl": tableau.site
                }
            }
        })
    }
  
    const resp = await fetch(url,options);
    if (resp.ok) {
        const data = await resp.json();
        return {
            'apiToken': data.credentials.token,
            'userId': data.credentials.user.id
        };
    } else {
        return null;
    }
  }

  return useQuery({
    queryKey: ['tableau', 'auth'],
    queryFn: async () => await tableauAuth(),
  });
}

export const useInsights = async () => {

  const getInsights = async () => {
  }

  return useQuery({
    queryKey: ['tableau', 'pulse', 'insights', id],
    queryFn: async () => await getInsights(),
    enabled: active,
  });
};
