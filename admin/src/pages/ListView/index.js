import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import get from "lodash/get";
import {
  LoadingIndicatorPage,
  useFocusWhenNavigate,
  useQueryParams,
  useNotification,
} from "@strapi/helper-plugin";
import { Main } from "@strapi/design-system/Main";
import {
  ContentLayout,
  HeaderLayout,
  ActionLayout,
} from "@strapi/design-system/Layout";
import { Button } from "@strapi/design-system/Button";
import { Link } from "@strapi/design-system/Link";
import ArrowLeft from "@strapi/icons/ArrowLeft";
import Plus from "@strapi/icons/Plus";
import { useHistory } from "react-router-dom";
import DynamicTable from "../../components/DynamicTable";
import {
  deleteUser,
  fetchStrapiUsers,
  fetchUsers,
} from "../HomePage/utils/api";
import PaginationFooter from "./PaginationFooter";
import SearchURLQuery from "../../components/SearchURLQuery";
import { matchSorter } from "match-sorter";
import { MapProviderToIcon } from "../../utils/provider";
import { formatUserData } from "../../utils/users";
import { useQuery } from "react-query";

/* eslint-disable react/no-array-index-key */
function ListView({ data, slug, meta, layout }) {
  const [rowsData, setRowsData] = useState(data);
  const [rowsMeta, setRowsMeta] = useState(meta);
  const [isLoading, setIsLoading] = useState(false);
  const [strapiUsersData, setStrapiUsersData] = useState([]);
  const canCreate = true;
  const canDelete = true;
  const headerLayoutTitle = "Firebase Users";
  const [query] = useQueryParams();

  useQuery("strapi-users", () => fetchStrapiUsers(), {
    onSuccess: (result) => {
      setStrapiUsersData(result);
    },
  });

  const {
    push,
    location: { pathname },
  } = useHistory();

  const toggleNotification = useNotification();

  useFocusWhenNavigate();

  let setNextPageToken = (page, nextPageToken) => {
    page = !page ? 1 : page;
    page = parseInt(page);
    const storeObject = localStorage.getItem("nextPageTokens");
    let newObject = {};
    if (storeObject) {
      newObject = JSON.parse(storeObject);
    }

    newObject[page + 1] = nextPageToken;
    localStorage.setItem("nextPageTokens", JSON.stringify(newObject));
  };

  let getNextPageToken = async (page) => {
    page = parseInt(page);
    const storeObject = localStorage.getItem("nextPageTokens");

    if (!storeObject) {
      return undefined;
    }
    const newObject = JSON.parse(storeObject);

    return newObject[page];
  };

  let fetchPaginatedUsers = async () => {
    let nextPageToken = await getNextPageToken(query.query?.page);

    if (nextPageToken) {
      query.query.nextPageToken = nextPageToken;
    }

    const response = await fetchUsers(query.query);

    if (response.pageToken) {
      setNextPageToken(query.query?.page, response.pageToken);
    }
    return formatUserData(response, strapiUsersData);
  };

  useEffect(() => {
    const fetchPaginatedData = async () => {
      setIsLoading(true);

      let response = await fetchPaginatedUsers();
      let data = response.data?.map((item) => {
        return {
          id: item.uid,
          ...item,
        };
      });
      if (query.query?._q) {
        data = matchSorter(data, query.query?._q, {
          keys: ["email", "displayName"],
        });
      }
      setRowsData(() => data);
      setRowsMeta(() => response.meta);
      setIsLoading(false);
    };
    fetchPaginatedData();
  }, [query.query, strapiUsersData]);

  const { formatMessage } = useIntl();

  const handleConfirmDeleteData = useCallback(
    async (idsToDelete) => {
      try {
        setIsLoading(true);
        if (Array.isArray(idsToDelete)) {
          await Promise.all(idsToDelete.map((id) => deleteUser(id)));
        } else {
          await deleteUser(idsToDelete);
        }

        let response = await fetchPaginatedUsers();

        let newDate = response.data.map((item) => {
          return {
            id: item.uid,
            ...item,
            providers: <MapProviderToIcon providerData={item.providerData} />,
          };
        });
        setRowsData(() => newDate);
        setRowsMeta(() => response.meta);
        setIsLoading(false);
        toggleNotification({
          type: "success",
          message: { id: "notification.success", defaultMessage: "Deleted" },
        });
        return rowsData;
      } catch (err) {
        const errorMessage = get(
          err,
          "response.payload.message",
          formatMessage({ id: "error.record.delete" })
        );
        setIsLoading(false);
        toggleNotification({
          type: "warning",
          message: errorMessage,
        });
      }
    },
    [slug, toggleNotification, formatMessage]
  );

  const getCreateAction = () => (
    <Button
      onClick={() => {
        push({
          pathname: `${pathname}/users/create`,
          state: { from: pathname },
        });
      }}
      startIcon={<Plus />}
    >
      Create
    </Button>
  );

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  const headSubtitle = `Showing ${rowsData?.length} entries`;

  return (
    <Main aria-busy={isLoading}>
      <HeaderLayout
        primaryAction={getCreateAction()}
        subtitle={headSubtitle}
        title={headerLayoutTitle}
        navigationAction={
          <Link startIcon={<ArrowLeft />} to="/content-manager/">
            Back
          </Link>
        }
      />
      <ActionLayout
        endActions={<></>}
        startActions={
          <>
            <SearchURLQuery
              label={formatMessage(
                {
                  id: "app.component.search.label",
                  defaultMessage: "Search for {target}",
                },
                { target: headerLayoutTitle }
              )}
              placeholder={formatMessage({
                id: "app.component.search.placeholder",
                defaultMessage: "Search...",
              })}
              trackedEvent="didSearch"
            />
          </>
        }
      />
      <ContentLayout>
        <>
          <DynamicTable
            isBulkable={true}
            canCreate={canCreate}
            canDelete={canDelete}
            contentTypeName={headerLayoutTitle}
            onConfirmDelete={handleConfirmDeleteData}
            onConfirmDeleteAll={handleConfirmDeleteData}
            isLoading={isLoading}
            rows={rowsData}
            action={getCreateAction({ variant: "secondary" })}
          />
          <PaginationFooter
            pagination={{ pageCount: rowsMeta?.pagination?.pageCount || 1 }}
          />
        </>
      </ContentLayout>
    </Main>
  );
}

ListView.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getData: PropTypes.func.isRequired,
  getDataSucceeded: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    total: PropTypes.number.isRequired,
    pageCount: PropTypes.number,
  }).isRequired,
};

export default memo(ListView);
