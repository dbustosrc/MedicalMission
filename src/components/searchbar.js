import { useEffect, useState, useRef } from "react";
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, IconButton, Collapse } from '@mui/material'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import ClearIcon from '@mui/icons-material/Clear'

const SearchBar = (props) => {
  // Screen
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  //Collapsible searchbar
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  //Searchbar
  const [search, setSearch] = useState(null);

  //Datatable
  const [dataTable, setDataTable] = useState(props.value || []);

  const iconButtonStyle = {
    backgroundColor: isCollapseOpen ? '#f0f0f0' : 'transparent',
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      if (search !== null || search !== '') {
        props.onSearch(dataTable.filter(row =>
          (row.personName?.toLowerCase().includes(search.toLowerCase()) || false) ||
          (row.identification?.toLowerCase().includes(search.toLowerCase()) || false) ||
          (row.idCardNumber?.toLowerCase().includes(search.toLowerCase()) || false)
        ));
      } else {
        props.onSearch(dataTable);
      }
    };
    if (search) {
      handleSearch();
    } else {
      props.onSearch(dataTable);
    }

  }, [search]);

  const onSearch = (searchQuery) => {
    setSearch(searchQuery);
  };

  const handleClear = () => {
    onSearch('');
    inputRef.current.focus();
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography style={{ marginLeft: '20px' }} variant="h5" mt={5} display="block" gutterBottom>
          {props.text}
        </Typography>
        <div style={{ marginLeft: 'auto' }}>
          <IconButton
            style={{ ...iconButtonStyle, marginRight: '12px', marginTop: '32px' }}
            aria-label="expand row"
            size="large"
            onClick={() => setIsCollapseOpen(!isCollapseOpen)}
          >
            {isCollapseOpen ? <PersonSearchIcon /> : <PersonSearchIcon />}
          </IconButton>
        </div>
      </div>
      <Collapse in={isCollapseOpen} timeout="auto" unmountOnExit>
        <Box
          sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%', maxWidth: { xs: screenWidth, sm: screenWidth } }}
        >
          <FormControl sx={{ m: 2, width: '100%' }}>
            <InputLabel htmlFor='outlined-adornment-amount'>Search filter</InputLabel>
            <OutlinedInput
              id='outlined-adornment-amount'
              inputRef={inputRef}
              onChange={(e) => onSearch(e.target.value.toLowerCase())}
              value={search}
              startAdornment={
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position='end'>
                  {props.value && (
                    <IconButton edge='end' onClick={handleClear}>
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              }
              label='Search filter'
            />
          </FormControl>
        </Box>
      </Collapse>
    </>
  );
};

export default SearchBar;