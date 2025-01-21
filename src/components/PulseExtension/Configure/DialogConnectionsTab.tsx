import { useState } from 'react';
import {
  Button, Input, Popover,
  PopoverTrigger,
  PopoverContent,
  CommandItem,
  CommandGroup,
  CommandList,
  Command, CommandEmpty
} from '../../ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils';
import { LoadMetricsOnly } from '..';

export const ConnectionTab = ({
  tableauUrlSubDomain,
  loginEnabled,
  handleLogin,
  handleSample,
  handleLogout,
  handleTableauUrlChange,
  metricCollection,
  setMetricCollection,
  loginData,
  updateLoginData,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<null | string>(null);
  const tableauUrls = [
    { value: 'prod-apnortheast-a', label: 'Asia Pacific - Japan - (prod-apnortheast-a)' },
    { value: 'prod-ca-a', label: 'Canada - Quebec - (prod-ca-a)' },
    { value: 'dub01', label: 'Europe - Ireland - (DUB01)' },
    { value: 'ew1a', label: 'Europe - Ireland - (EW1A)' },
    { value: 'prod-uk-a', label: 'Europe - UK - (prod-uk-a)' },
    { value: 'us-east-1', label: 'United States - East - (us-east-1)' },
    { value: 'prod-useast-a', label: 'United States - East - (prod-useast-a)' },
    { value: 'prod-useast-b', label: 'United States - East - (prod-useast-b)' },
    { value: '10ax', label: 'United States - West - (10AX)' },
    { value: '10ay', label: 'United States - West - (10AY)' },
    { value: '10az', label: 'United States - West - (10AZ)' },
    { value: 'us-west-2a', label: 'United States - West - (UW2A)' },
    { value: 'uw2b', label: 'United States - West - (UW2B)' },
  ];

  return (
    <div>
      <span className="text-2xl font-extrabold">Connection to Tableau</span>
      <div className="inputDiv mb-1">
        <label htmlFor="userName">User Name</label>
        <Input
          type="string"
          id="userName"
          value={loginData.userName}
          onChange={(e) => updateLoginData('userName', e.target.value)}
          placeholder="Enter User Name"
          title="User Name"
        />
      </div>

      <label htmlFor="tableauUrl">Tableau Pod</label>
      <Popover
        open={activeTooltip === 'tableauUrl'}
        onOpenChange={() => setActiveTooltip('tableauUrl')}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={activeTooltip === 'tableauUrl'}
            className="w-full justify-between"
            id="tableauUrl"
          >
            {tableauUrlSubDomain
              ? tableauUrls.find((_tableauUrl) => _tableauUrl.value === tableauUrlSubDomain)?.label
              : 'Select location...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {/* <CommandInput placeholder="Search framework..." /> */}
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {tableauUrls.map((_tableauUrl) => (
                  <CommandItem
                    key={_tableauUrl.value}
                    value={_tableauUrl.value}
                    onSelect={(currentValue) => {
                      handleTableauUrlChange(currentValue);
                      setActiveTooltip('');
                    }}
                  >
                    {_tableauUrl.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        tableauUrlSubDomain === _tableauUrl.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="inputDiv">
        <label htmlFor="site_id">Site Name</label>
        <Input
          type="text"
          id="site_id"
          value={loginData.site_id}
          onChange={(e) => updateLoginData('site_id', e.target.value)}
          placeholder="Enter Site Name"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caClientId">Client ID</label>
        <Input
          type="text"
          id="caClientId"
          value={loginData.caClientId}
          onChange={(e) => updateLoginData('caClientId', e.target.value)}
          placeholder="Enter Client ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretId">Secret ID</label>
        <Input
          type="text"
          id="caSecretId"
          value={loginData.caSecretId}
          onChange={(e) => updateLoginData('caSecretId', e.target.value)}
          placeholder="Enter Secret ID"
        />
      </div>
      <div className="inputDiv">
        <label htmlFor="caSecretValue">Secret Value</label>
        <Input
          type="text"
          id="caSecretValue"
          value={loginData.caSecretValue}
          onChange={(e) => updateLoginData('caSecretValue', e.target.value)}
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
      {loginEnabled && loginData.userName !== '' && (
        <LoadMetricsOnly
          metricCollection={metricCollection}
          setMetricCollection={setMetricCollection}
          loginData={loginData}
        />
      )}
    </div>
  );
};
