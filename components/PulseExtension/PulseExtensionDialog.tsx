import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '../ui';
import { useSession, signIn, signOut } from 'next-auth/react';
import { TableauExtension } from '../TableauExtension';
import { set } from 'date-fns';

const ConnectionTab = ({
  tableauUrl,
  setTableauUrl,
  tableauUrlFQDN,
  setTableauUrlFQDN,
  siteName,
  setSiteName,
  userName,
  setUserName,
  caClientId,
  setCaClientId,
  caSecretId,
  setCaSecretId,
  caSecretValue,
  setCaSecretValue,
  status,
  loginEnabled,
  handleLogin,
  handleSample,
  handleLogout,
  handleTableauUrlChange,
  handleUserName,
  handleSiteName,
  handleCaClientId,
  handleCaSecretId,
  handleCaSecretValue,
}) => {
  return (
    <div>
      <span className="text-2xl font-extrabold">Connection to Tableau:</span>
      <div className="inputDiv mb-1">
        <label htmlFor="userName">User Name</label>
        <Input
          type="text"
          id="userName"
          value={userName}
          onChange={handleUserName}
          placeholder="Enter User Name"
          title="User Name"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="tableauUrl">Tableau Pod</label>
        <select id="tableauUrl" value={tableauUrl} onChange={handleTableauUrlChange}>
          <option value="prod-apsoutheast-a">
            Asia Pacific - Australia - (prod-apsoutheast-a)
          </option>
          <option value="prod-apnortheast-a">Asia Pacific - Japan - (prod-apnortheast-a)</option>
          <option value="prod-ca-a">Canada - Quebec - (prod-ca-a)</option>
          <option value="dub01">Europe - Ireland - (DUB01)</option>
          <option value="ew1a">Europe - Ireland - (EW1A)</option>
          <option value="prod-uk-a">Europe - UK - (prod-uk-a)</option>
          <option value="useast-1">United States - East - (useast-1)</option>
          <option value="prod-useast-a">United States - East - (prod-useast-a)</option>
          <option value="prod-useast-b">United States - East - (prod-useast-b)</option>
          <option value="10ax">United States - West - (10AX)</option>
          <option value="10ay">United States - West - (10AY)</option>
          <option value="10az">United States - West - (10AZ)</option>
          <option value="uw2b">United States - West - (UW2B)</option>
        </select>
      </div>
      <div className="inputDiv">
        <label htmlFor="siteName">Site Name</label>
        <Input
          type="text"
          id="siteName"
          value={siteName}
          onChange={handleSiteName}
          placeholder="Enter Site Name"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caClientId">Client ID</label>
        <Input
          type="text"
          id="caClientId"
          value={caClientId}
          onChange={handleCaClientId}
          placeholder="Enter Client ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretId">Secret ID</label>
        <Input
          type="text"
          id="caSecretId"
          value={caSecretId}
          onChange={handleCaSecretId}
          placeholder="Enter Secret ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretValue">Secret Value</label>
        <Input
          type="text"
          id="caSecretValue"
          value={caSecretValue}
          onChange={handleCaSecretValue}
          placeholder="Enter Secret Value"
        />
      </div>
      <Button id="loginButton" onClick={handleLogin}>
        Login
      </Button>
      <Button id="loadSample" onClick={handleSample}>
        Load Sample Values
      </Button>
      <Button id="logoutButton" onClick={handleLogout}>
        Logout
      </Button>
      {loginEnabled && userName !== "" && (
        <TableauExtension
          tableauUrl={tableauUrlFQDN}
          siteName={siteName}
          userName={userName}
          caClientId={caClientId}
          caSecretId={caSecretId}
          caSecretValue={caSecretValue}
          showMetrics={false}
          isDashboardExtension={'true'}
        />
      )}
    </div>
  );
};

const OptionsTab = ({
  companionMode,
  setCompanionMode,
  handleCompanionModeChange,
  debug,
  handleDebugCheckboxChange,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  return (
    <div>
      <label htmlFor="companionModeDropdown" style={{ position: 'relative' }}>
        Choose a companion mode:
        <span
          className="tooltip-icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          i
          {showTooltip && (
            <div className="tooltip-content">
              <span className="tooltiptext">
                Select "None" if insights should display in this same extension.
                <br />
                Select "Source" if you want insights to display in another extension in the same
                dashboard.
                <br />
                Select "Target" if this is the extension where you want insights to display.
              </span>
            </div>
          )}
        </span>
      </label>
      <select id="companionModeDropdown" value={companionMode} onChange={handleCompanionModeChange}>
        <option value="none">None</option>
        <option value="source">Source</option>
        <option value="target">Target</option>
      </select>

      <div>
        <label htmlFor="checkbox" className="mr-3">
          Debug Mode:
        </label>
        <input
          title="Debug Mode: Check to show detailed troubleshooting information in the extension and the console."
          type="checkbox"
          id="debug"
          checked={debug}
          onChange={handleDebugCheckboxChange}
        />
      </div>

      <style jsx>{`
        .tooltip-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          background-color: blue;
          color: white;
          border-radius: 50%;
          text-align: center;
          margin-left: 8px;
          cursor: pointer;
          font-size: 12px;
          line-height: 16px;
          position: relative;
        }

        .tooltip-content {
          position: absolute;
          background-color: #333;
          color: #fff;
          padding: 5px;
          border-radius: 4px;
          width: 400px;
          z-index: 100;
          font-size: 12px;
          top: 20px; /* Adjust this value as needed to control the tooltip's vertical position */
          left: -50%;
          transform: translateX(-50%);
        }

        .tooltip-content::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent #333 transparent;
        }
      `}</style>
    </div>
  );
};

const MetricsTab = ({
  loginEnabled,
  tableauUrlFQDN,
  siteName,
  userName,
  caClientId,
  caSecretId,
  caSecretValue,
}) => {
  return (
    <div>
      Metrics Component
      <br />
      This tab will be used in the future to customize the metrics.
      <div className="mt-3">
        {loginEnabled ? (
          <TableauExtension
            tableauUrl={tableauUrlFQDN}
            siteName={siteName}
            userName={userName}
            caClientId={caClientId}
            caSecretId={caSecretId}
            caSecretValue={caSecretValue}
            showMetrics={false}
            isDashboardExtension={'true'}
          />
        ) : (
          `Login on the Connection tab`
        )}
      </div>
    </div>
  );
};

const NavigationTabs = ({ activeTab, setActiveTab, ...props }) => {
  return (
    <div>
      <div className="tabs">
        <div
          className={activeTab === 'connection' ? 'active' : ''}
          onClick={() => setActiveTab('connection')}
        >
          Connection
        </div>
        <div
          className={activeTab === 'metrics' ? 'active' : ''}
          onClick={() => setActiveTab('metrics')}
        >
          Metrics
        </div>
        <div
          className={activeTab === 'options' ? 'active' : ''}
          onClick={() => setActiveTab('options')}
        >
          Options
        </div>
      </div>

      <div className="content">
        {activeTab === 'connection' && <ConnectionTab {...(props as any)} />}
        {activeTab === 'metrics' && <MetricsTab {...(props as any)} />}
        {activeTab === 'options' && <OptionsTab {...(props as any)} />}
      </div>

      <style jsx>{`
        .tabs {
          display: flex;
          justify-content: space-around;
          padding: 1rem;
          background: #f0f0f0;
          cursor: pointer;
        }
        .tabs div {
          padding: 0.5rem 1rem;
        }
        .tabs .active {
          font-weight: bold;
          border-bottom: 2px solid #000;
        }
        .content {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export const PulseExtensionDialog = (props: any) => {
  const [tableauUrl, setTableauUrl] = useState<string>('undefined');
  const tableauUrlRef = useRef<string>(tableauUrl);
  const [tableauUrlFQDN, setTableauUrlFQDN] = useState<string>('undefined');
  const tableauUrlFQDNRef = useRef<string>(tableauUrlFQDN);
  const [siteName, setSiteName] = useState<string>('undefined');
  const siteNameRef = useRef<string>(siteName);
  const [userName, setUserName] = useState<string>('undefined');
  const userNameRef = useRef<string>(userName);
  const [caClientId, setCaClientId] = useState<string>('undefined');
  const caClientIdRef = useRef<string>(caClientId);
  const [caSecretId, setCaSecretId] = useState<string>('undefined');
  const caSecretIdRef = useRef<string>(caSecretId);
  const [caSecretValue, setCaSecretValue] = useState<string>('undefined');
  const caSecretValueRef = useRef<string>(caSecretValue);
  const [loginEnabled, setLoginEnabled] = useState<boolean>(false);
  const [companionMode, setCompanionMode] = useState('none');
  const companionModeRef = useRef<string>(companionMode);
  const [debug, setDebug] = useState<boolean>(false);
  const debugModeRef = useRef<string>(debug ? 'true' : 'false');
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('connection');

  const validateAndFormatTableauUrl = (url: string) => {
    // Remove extra https:// instances
    url = url.replace(/https:\/\//g, 'https://').replace(/\/$/, '');
    // Ensure only one https:// and proper domain
    const urlPattern = /^https:\/\/([a-z0-9-]+)\.online\.tableau\.com$/;
    const match = url.match(urlPattern);
    if (match) {
      return url; // Return validated and formatted full URL
    }
    // If invalid, return a default valid URL
    return 'https://prod-apsoutheast-a.online.tableau.com';
  };
  const extractSubdomain = (url: string) => {
    const urlPattern = /^https:\/\/([a-z0-9-]+)\.online\.tableau\.com$/;
    const match = url.match(urlPattern);
    if (match) {
      return match[1]; // Return the subdomain
    }
    return null; // If invalid URL
  };

  async function saveSettings() {
    // Here you can do whatever you want with the selected metrics
    tableau.extensions.settings.set('tableauUrl', tableauUrlFQDNRef.current);
    tableau.extensions.settings.set('siteName', siteNameRef.current);
    tableau.extensions.settings.set('userName', userNameRef.current);
    tableau.extensions.settings.set('caClientId', caClientIdRef.current);
    tableau.extensions.settings.set('caSecretId', caSecretIdRef.current);
    tableau.extensions.settings.set('caSecretValue', caSecretValueRef.current);
    tableau.extensions.settings.set('companionMode', companionModeRef.current);
    tableau.extensions.settings.set('debug', debugModeRef.current);

    try {
      await tableau.extensions.settings.saveAsync();
    } catch (error) {
      console.log(`an error occurred closing the dialogue box: ${error} ${error.stack}`);
    }
  }
  /**
   * Stores the selected datasource IDs in the extension settings,
   * closes the dialog, and sends a payload back to the parent.
   */
  function closeDialog() {
    console.log('Closing dialog...');
    var selectedMetrics: string[] = [];
    var checkboxes = document.querySelectorAll('input[name=metrics]:checked');
    checkboxes.forEach((checkbox: any) => {
      selectedMetrics.push(checkbox.value);
    });
    console.log('Selected Metrics:', selectedMetrics);
    saveSettings();

    let obj = {
      tableauUrl: tableauUrlFQDNRef.current,
      siteName: siteNameRef.current,
      userName: userNameRef.current,
      caClientId: caClientIdRef.current,
      caSecretId: caSecretIdRef.current,
      caSecretValue: caSecretValueRef.current,
      companionMode: companionModeRef.current,
      debug: debugModeRef.current,
    };
    console.log(`Saving dialog settings: ${JSON.stringify(obj)}`);
    // await delay(10000);  // enable this to debug when hitting the close button
    tableau.extensions.ui.closeDialog(JSON.stringify(obj));
  }

  useEffect(() => {
    const handleDialogClose = () => closeDialog();

    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
      closeButton.addEventListener('click', handleDialogClose);
    }

    return () => {
      if (closeButton) {
        closeButton.removeEventListener('click', handleDialogClose);
      }
    };
  }, []);
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    tableau.extensions.initializeDialogAsync().then(function (settingsStr: string) {
      let passedSettings = JSON.parse(settingsStr);
      console.log(`Opening with settings: ${JSON.stringify(passedSettings)}`);
      
      document.getElementById('closeButton')?.addEventListener('click', closeDialog);
      if (settingsStr !== "{}"){
        setSiteName(passedSettings.siteName);
        setUserName(passedSettings.userName);
        setCaClientId(passedSettings.caClientId);
        setCaSecretId(passedSettings.caSecretId);
        setCaSecretValue(passedSettings.caSecretValue);
        setCompanionMode(passedSettings.companionMode);
        setDebug(passedSettings.debug === 'true' ? true : false);
      }
      
      // Validate and set tableauUrlFQDN
      if (typeof passedSettings.tableauUrl !== 'undefined'){
        let tableauUrl = passedSettings.tableauUrl;
        const subdomain = extractSubdomain(tableauUrl);
        if (subdomain) {
          setTableauUrl(subdomain);
          setTableauUrlFQDN(validateAndFormatTableauUrl(tableauUrl));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      setLoginEnabled(true);
      document.querySelectorAll('input').forEach((input: any) => {
        if (input.id !== 'debug') {
          input.disabled = true;
        }
      });
      document.getElementById('tableauUrl')?.setAttribute('disabled', 'disabled');
      document.getElementById('loginButton')?.classList.add('hidden');
      document.getElementById('loadSample')?.classList.add('hidden');
      document.getElementById('logoutButton')?.classList.remove('hidden');
    } else {
      setLoginEnabled(false);
      document.querySelectorAll('input').forEach((input: any) => {
        input.disabled = false;
      });
      document.getElementById('tableauUrl')?.removeAttribute('disabled');
      document.getElementById('loginButton')?.classList.remove('hidden');
      document.getElementById('loadSample')?.classList.remove('hidden');
      document.getElementById('logoutButton')?.classList.add('hidden');
    }
  }, [status, activeTab]);

  const handleDebugCheckboxChange = () => {
    setDebug(!debug);
    debugModeRef.current = !debug ? 'true' : 'false';
  };

  useEffect(() => {
    tableauUrlRef.current = tableauUrl;
    let url = `https://${tableauUrl}.online.tableau.com`;
    setTableauUrlFQDN(url);
    tableauUrlFQDNRef.current = url;
  }, [tableauUrl]);

  useEffect(() => {
    siteNameRef.current = siteName;
  }, [siteName]);

  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  useEffect(() => {
    caClientIdRef.current = caClientId;
  }, [caClientId]);

  useEffect(() => {
    caSecretIdRef.current = caSecretId;
  }, [caSecretId]);

  useEffect(() => {
    caSecretValueRef.current = caSecretValue;
  }, [caSecretValue]);

  const handleCompanionModeChange = (event: any) => {
    setCompanionMode(event.target.value);
    companionModeRef.current = event.target.value;
  };

  const handleUserName = (event: any) => {
    setUserName(event.target.value);
    userNameRef.current = event.target.value;
  };

  const handleSiteName = (event: any) => {
    setSiteName(event.target.value);
    siteNameRef.current = event.target.value;
  };

  const handleCaClientId = (event: any) => {
    setCaClientId(event.target.value);
    caClientIdRef.current = event.target.value;
  };

  const handleCaSecretId = (event: any) => {
    setCaSecretId(event.target.value);
    caSecretIdRef.current = event.target.value;
  };

  const handleCaSecretValue = (event: any) => {
    setCaSecretValue(event.target.value);
    caSecretValueRef.current = event.target.value;
  };

  const handleTableauUrlChange = (event: any) => {
    setTableauUrl(event.target.value);
    tableauUrlRef.current = event.target.value;
  };

  function handleLogin() {
    // setLoginEnabled(true);
    saveSettings().then(() => {
      console.log(`settings saved`);
      setLoginEnabled(true);
    });
  }
  function handleSample() {
      setCaClientId('6b828aa5-dd31-4c35-9be9-fddf7e0b7933');
      setCaSecretId('d7949278-f28e-48cf-8313-765c17972961');
      setCaSecretValue('dwPRgqnLDAO4G5GOrgmnylkAK5ODXxKfS/hEhTyZtzA=');
      setSiteName('rgdemosite');
      setUserName('rgoldin@salesforce.com');

      let tableauUrl = 'https://10az.online.tableau.com';
      const subdomain = extractSubdomain(tableauUrl);
      if (subdomain) {
        setTableauUrl(subdomain);
        setTableauUrlFQDN(validateAndFormatTableauUrl(tableauUrl));
      }
  }

  const handleLogout = async () => {
    console.log('Signing Out...');
    setLoginEnabled(false);
    await signOut({ redirect: false });
  };

  useEffect(() => {
    if (status === 'authenticated') {
      setLoginEnabled(true);
    } else {
      setLoginEnabled(false);
    }
  }, [status]);

  return (
    <div className="container mx-auto p-4">
      <div className="">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tableauUrl={tableauUrl}
          setTableauUrl={setTableauUrl}
          tableauUrlFQDN={tableauUrlFQDN}
          setTableauUrlFQDN={setTableauUrlFQDN}
          siteName={siteName}
          setSiteName={setSiteName}
          userName={userName}
          setUserName={setUserName}
          caClientId={caClientId}
          setCaClientId={setCaClientId}
          caSecretId={caSecretId}
          setCaSecretId={setCaSecretId}
          caSecretValue={caSecretValue}
          setCaSecretValue={setCaSecretValue}
          status={status}
          loginEnabled={loginEnabled}
          handleLogin={handleLogin}
          handleSample={handleSample}
          handleLogout={handleLogout}
          handleTableauUrlChange={handleTableauUrlChange}
          handleUserName={handleUserName}
          handleSiteName={handleSiteName}
          handleCaClientId={handleCaClientId}
          handleCaSecretId={handleCaSecretId}
          handleCaSecretValue={handleCaSecretValue}
          companionMode={companionMode}
          setCompanionMode={setCompanionMode}
          handleCompanionModeChange={handleCompanionModeChange}
          debug={debug}
          handleDebugCheckboxChange={handleDebugCheckboxChange}
        />
      </div>
      <Button id="closeButton">Close and Save</Button>
    </div>
  );
};
