import React from 'react';
import {
  Box,
  Pagination,
  PaginationItem,
  useTheme,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from '@mui/icons-material';

const Paging = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 25, 50],
  showItemsPerPage = true,
  showTotalItems = true,
}) => {
  const theme = useTheme();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  const handleItemsPerPageChange = (event) => {
    onItemsPerPageChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showTotalItems && (
          <Typography variant="body2" color="text.secondary">
            Tổng số: {totalItems} mục
          </Typography>
        )}
        {showItemsPerPage && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Mỗi trang</InputLabel>
            <Select
              value={itemsPerPage}
              label="Mỗi trang"
              onChange={handleItemsPerPageChange}
              sx={{
                height: 32,
                '& .MuiSelect-select': {
                  py: 0.5,
                },
              }}
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="medium"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: 1,
            minWidth: 32,
            height: 32,
            margin: '0 2px',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
          '& .MuiPaginationItem-ellipsis': {
            minWidth: 32,
            height: 32,
          },
        }}
        renderItem={(item) => {
          if (item.type === 'first') {
            return (
              <PaginationItem
                {...item}
                icon={<FirstPageIcon />}
                sx={{ borderRadius: 1 }}
              />
            );
          }
          if (item.type === 'last') {
            return (
              <PaginationItem
                {...item}
                icon={<LastPageIcon />}
                sx={{ borderRadius: 1 }}
              />
            );
          }
          if (item.type === 'next') {
            return (
              <PaginationItem
                {...item}
                icon={<NavigateNextIcon />}
                sx={{ borderRadius: 1 }}
              />
            );
          }
          if (item.type === 'previous') {
            return (
              <PaginationItem
                {...item}
                icon={<NavigateBeforeIcon />}
                sx={{ borderRadius: 1 }}
              />
            );
          }
          return <PaginationItem {...item} />;
        }}
      />
    </Box>
  );
};

export default Paging; 