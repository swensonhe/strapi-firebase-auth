import React, { memo, useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import get from "lodash/get";
import {
  LoadingIndicatorPage,
  useFocusWhenNavigate,
  useQueryParams,
  useNotification,
} from "@strapi/helper-plugin";
import { Main } from "@strapi/design-system";
import {
  ContentLayout,
  HeaderLayout,
  ActionLayout,
} from "@strapi/design-system";
import { Button } from "@strapi/design-system";
import { Link } from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";
import { Plus } from "@strapi/icons";
import { useHistory } from "react-router-dom";
import { FirebaseTable } from "../../components/DynamicTable/FirebaseTable";
import { deleteUser, fetchUsers } from "../HomePage/utils/api";
import { PaginationFooter } from "./PaginationFooter";
import SearchURLQuery from "../../components/SearchURLQuery/SearchURLQuery";
import { matchSorter } from "match-sorter";
import { User } from "../../../../model/User";
import { ResponseMeta } from "../../../../model/Meta";

interface ListViewProps {
  data: any;
  slug: any;
  meta: ResponseMeta;
}

/* eslint-disable react/no-array-index-key */
function ListView({ data, slug, meta }: ListViewProps) {
  const [rowsData, setRowsData] = useState<User[]>(data);
  const [rowsMeta, setRowsMeta] = useState<ResponseMeta>(meta);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const headerLayoutTitle = "Firebase Users";
  const [query] = useQueryParams();
  console.log("rowsMeta", rowsMeta, slug);

  const {
    push,
    location: { pathname },
  } = useHistory();

  const toggleNotification = useNotification();

  useFocusWhenNavigate();

  let setNextPageToken = (page: string, nextPageToken: string) => {
    const formattedPage = parseInt(page) || 1;
    const storeObject = localStorage.getItem("nextPageTokens");
    let newObject: any = {};
    if (storeObject) {
      newObject = JSON.parse(storeObject);
    }

    newObject[formattedPage + 1] = nextPageToken;
    localStorage.setItem("nextPageTokens", JSON.stringify(newObject));
  };

  let getNextPageToken = async (page: string) => {
    const formattedPage = parseInt(page);
    const storeObject = localStorage.getItem("nextPageTokens");

    if (!storeObject) {
      return undefined;
    }
    const newObject = JSON.parse(storeObject);

    return newObject[formattedPage];
  };

  let fetchPaginatedUsers = async () => {
    let nextPageToken = await getNextPageToken(query.query?.page);

    if (nextPageToken) {
      query.query.nextPageToken = nextPageToken;
    }
    console.log("query.query", query.query);
    const response = await fetchUsers(query.query);

    if (response.pageToken) {
      setNextPageToken(query.query?.page, response.pageToken);
    }
    return response;
  };

  useEffect(() => {
    const fetchPaginatedData = async () => {
      setIsLoading(true);

      let response = await fetchPaginatedUsers();
      let data = response.data?.map((item: any) => {
        return {
          id: item.uid,
          ...item,
        };
      });
      if (query.query?._q) {
        data = matchSorter(data, query.query?._q, {
          keys: ["email", "displayName", "username"],
        });
      }
      setRowsData(() => data);
      setRowsMeta(() => response.meta);
      setIsLoading(false);
    };
    fetchPaginatedData();
  }, [query.query]);

  const { formatMessage } = useIntl();

  const handleConfirmDeleteData = async (
    idsToDelete: string | string[],
    isStrapiIncluded: boolean,
    isFirebaseIncluded: boolean
  ) => {
    console.log(
      "idsToDelete",
      idsToDelete,
      isStrapiIncluded,
      isFirebaseIncluded
    );
    let destination: string | null = null;
    if (isStrapiIncluded && isFirebaseIncluded) {
      destination = null;
    } else if (isStrapiIncluded) {
      destination = "strapi";
    } else if (isFirebaseIncluded) destination = "firebase";
    try {
      setIsLoading(true);
      if (Array.isArray(idsToDelete)) {
        await Promise.all(idsToDelete.map((id) => deleteUser(id, null)));
      } else {
        await deleteUser(idsToDelete, destination);
      }

      let response = await fetchPaginatedUsers();

      let newDate = response.data.map((item: any) => {
        return {
          id: item.uid,
          ...item,
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
      return Promise.reject([]);
    }
  };

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

  const headSubtitle = `Showing ${rowsData?.length || 0} entries`;
  console.log("isss", rowsData, rowsMeta);

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
          <FirebaseTable
            onConfirmDelete={handleConfirmDeleteData}
            onConfirmDeleteAll={handleConfirmDeleteData}
            isLoading={isLoading}
            rows={rowsData}
            action={getCreateAction()}
          />
          <PaginationFooter pageCount={rowsMeta?.pagination?.pageCount || 1} />
        </>
      </ContentLayout>
    </Main>
  );
}

export default memo(ListView);
