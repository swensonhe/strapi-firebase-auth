import React, { useLayoutEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { SearchIcon } from "@strapi/icons";
import { Searchbar, SearchForm } from "@strapi/design-system";
import { IconButton } from "@strapi/design-system";
import { Icon } from "@strapi/design-system";
import useQueryParams from "../../hooks/useQueryParams";

interface SearchURLQuery {
  label: string;
  placeholder: string;
}

const SearchURLQuery = ({ label, placeholder }: SearchURLQuery) => {
  const wrapperRef: any = useRef(null);
  const iconButtonRef = useRef(null);

  const { query, setQuery } = useQueryParams();
  const [value, setValue] = useState(query?._q || "");
  const [isOpen, setIsOpen] = useState(!!value);
  const { formatMessage } = useIntl();

  const handleToggle = () => setIsOpen((prev) => !prev);

  useLayoutEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        wrapperRef.current?.querySelector("input").focus();
      }, 0);
    }
  }, [isOpen]);

  const handleClear = () => {
    setValue("");
    setQuery({ _q: "" }, "remove");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (value) {
      setQuery({ _q: value, page: 1 });
    } else {
      handleToggle();
      setQuery({ _q: "" }, "remove");
    }
  };

  if (isOpen) {
    return (
      <div ref={wrapperRef} style={{ width: "100%" }}>
        <SearchForm onSubmit={handleSubmit}>
          <Searchbar
            name="search"
            onChange={({ target: { value } }: any) => setValue(value)}
            value={value}
            clearLabel={formatMessage({
              id: "clearLabel",
              defaultMessage: "Clear",
            })}
            onClear={handleClear}
            size="S"
            placeholder={placeholder}
          >
            {label}
          </Searchbar>
        </SearchForm>
      </div>
    );
  }

  return (
    <IconButton
      ref={iconButtonRef}
      icon={<Icon as={SearchIcon} color="neutral800" />}
      label="Search"
      onClick={handleToggle}
    />
  );
};

SearchURLQuery.defaultProps = {
  placeholder: undefined,
  trackedEvent: null,
};

SearchURLQuery.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  trackedEvent: PropTypes.string,
};

export default SearchURLQuery;
