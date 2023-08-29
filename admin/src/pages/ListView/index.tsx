import React, { memo, useEffect, useState } from "react";
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
import {
  deleteUser,
  fetchUsers,
  resetUserPassword,
} from "../HomePage/utils/api";
import { PaginationFooter } from "./PaginationFooter";
import SearchURLQuery from "../../components/SearchURLQuery/SearchURLQuery";
import { matchSorter } from "match-sorter";
import { User } from "../../../../model/User";
import { ResponseMeta } from "../../../../model/Meta";
import { DeleteAccount } from "../../components/UserManagement/DeleteAccount";
import { ResetPassword } from "../../components/UserManagement/ResetPassword";

interface ListViewProps {
  data: any;
  meta: ResponseMeta;
}

/* eslint-disable react/no-array-index-key */
function ListView({ data, meta }: ListViewProps) {
  const [showResetPasswordDialogue, setShowResetPasswordDialogue] = useState({
    isOpen: false,
    email: "",
    id: "",
  });
  const [showDeleteAccountDialogue, setShowDeleteAccountDialogue] = useState({
    isOpen: false,
    email: "",
    id: "",
  });

  const [rowsData, setRowsData] = useState<User[]>(data);
  const [rowsMeta, setRowsMeta] = useState<ResponseMeta>(meta);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const headerLayoutTitle = "Firebase Users";
  const [query] = useQueryParams();

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
      setRowsData(data);
      setRowsMeta(response.meta);
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

      let newData = response.data.map((item: any) => {
        return {
          id: item.uid,
          ...item,
        };
      });
      setRowsData(newData);
      setRowsMeta(response.meta);
      setIsLoading(false);
      toggleNotification({
        type: "success",
        message: { id: "notification.success", defaultMessage: "Deleted" },
      });
      return newData;
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
  const handleCloseResetDialogue = () => {
    setShowResetPasswordDialogue({ isOpen: false, email: "", id: "" });
  };
  const handleCloseDeleteDialogoue = () => {
    setShowDeleteAccountDialogue({ isOpen: false, email: "", id: "" });
  };

  const resetPassword = async (newPassword: string) => {
    try {
      await resetUserPassword(showResetPasswordDialogue.id, {
        password: newPassword,
      });
      handleCloseResetDialogue();
      toggleNotification({
        type: "success",
        message: {
          id: "notification.success",
          defaultMessage: "Saved",
        },
      });
    } catch (err) {
      toggleNotification({
        type: "success",
        message: {
          id: "notification.error",
          defaultMessage: "Error resetting password, please try again",
        },
      });
    }
  };

  const deleteAccount = async (
    isStrapiIncluded: boolean,
    isFirebaseIncluded: boolean
  ) => {
    const newRowsData = await handleConfirmDeleteData(
      showDeleteAccountDialogue.id,
      isStrapiIncluded,
      isFirebaseIncluded
    );
    handleCloseDeleteDialogoue();
    setRowsData(newRowsData);
  };

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
          <ResetPassword
            isOpen={showResetPasswordDialogue.isOpen}
            email={showResetPasswordDialogue.email}
            onClose={handleCloseResetDialogue}
            onConfirm={resetPassword}
          />
          <DeleteAccount
            isOpen={showDeleteAccountDialogue.isOpen}
            email={showDeleteAccountDialogue.email}
            onToggleDialog={handleCloseDeleteDialogoue}
            onConfirm={deleteAccount}
            isSingleRecord
          />
          <FirebaseTable
            onConfirmDelete={handleConfirmDeleteData}
            onConfirmDeleteAll={handleConfirmDeleteData}
            isLoading={isLoading}
            rows={rowsData}
            action={getCreateAction()}
            onResetPasswordClick={({ email, uid }) => {
              setShowResetPasswordDialogue({
                isOpen: true,
                email,
                id: uid,
              });
            }}
            onDeleteAccountClick={({ email, uid }) => {
              setShowDeleteAccountDialogue({
                isOpen: true,
                email,
                id: uid,
              });
            }}
          />
          <PaginationFooter pageCount={rowsMeta?.pagination?.pageCount || 1} />
        </>
      </ContentLayout>
    </Main>
  );
}

export default memo(ListView);
