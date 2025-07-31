import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import TextArea from "../../../components/common/Textarea";
import ButtonSm from "../../../components/common/Buttons";
import type { FormState } from "../../../types/appTypes";
import type { ClientDetails } from "../../../types/masterApiTypes";
import {
  useCreateClient,
  useEditClient,
} from "../../../queries/masterQueries/ClientQuery";

const ClientEdit = ({
  clientDetails,
  formState,
  setFormState,
  setClient,
}: {
  clientDetails: ClientDetails | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setClient: React.Dispatch<React.SetStateAction<ClientDetails>>;
}) => {
  const [clientData, setClientData] = useState<ClientDetails | null>(null);

  const {
    mutate: createClient,
    isPending,
    isSuccess,
  } = useCreateClient();

  const {
    mutate: updateClient,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditClient();

  const disableButton =
    clientDetails?.clientName === clientData?.clientName &&
    clientDetails?.contactNumber === clientData?.contactNumber &&
    clientDetails?.contactPerson === clientData?.contactPerson &&
    clientDetails?.email === clientData?.email &&
    clientDetails?.address === clientData?.address &&
    clientDetails?.gstNumber === clientData?.gstNumber;


    const resetData = {
      id: 0,
      clientName: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      address: "",
      gstNumber: "",
    };

  useEffect(() => {
    if (formState === "create") {
      setClientData(resetData);
    } else if (clientDetails) {
      setClientData(clientDetails);
    }
  }, [clientDetails, formState]);

  useEffect(() => {
    if (isSuccess) {
     
      setFormState("create");
      setClient(resetData);
      setClientData(resetData);
    } else if (isUpdatingSuccess && clientData) {
      setFormState("create");
      setClient(clientData);
    }
  }, [isSuccess, isUpdatingSuccess]);

  const handleCancel = () => {
    setFormState("create");
    
    setClient(resetData);
    setClientData(resetData);
  };

  if (!clientData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a client to view details.
      </p>
    );
  }

  const hasData =
    clientData.clientName ||
    clientData.contactPerson ||
    clientData.contactNumber;

  return (
    <main className="flex max-h-full  w-full max-w-[870px] flex-col gap-2">
      <div className="client-config-container flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (formState === "create" && clientData) {
              createClient(clientData);
            }
          }}
        >
          <header className="flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Client Configuration"
                : `${clientDetails?.clientName} Configuration`}
            </h1>
            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === "edit" ||
                (formState === "create" && hasData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}

              {formState === "display" && clientData.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  type="button"
                  onClick={handleCancel}
                />
              )}

              {formState === "create" && (
                <ButtonSm
                  className="font-medium text-white"
                  text={isPending ? "Creating..." : "Create New"}
                  state="default"
                  type="submit"
                  disabled={isPending}
                />
              )}

              {formState === "edit" && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-50"
                  text={isUpdatePending ? "Updating..." : "Save Changes"}
                  state="default"
                  type="button"
                  disabled={disableButton || isUpdatePending}
                  onClick={() => {
                    if (clientData) {
                      updateClient(clientData);
                    }
                  }}
                />
              )}
            </section>
          </header>

          {/* Client Fields */}
          <section className="flex w-full flex-col gap-2 overflow-clip px-3">
            <Input
              required
              disabled={formState === "display"}
              title="Client Name"
              type="str"
              inputValue={clientData.clientName}
              name="clientName"
              placeholder="Enter client name"
              maxLength={50}
              onChange={(value) =>
                setClientData({ ...clientData, clientName: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Contact Person"
              type="str"
              inputValue={clientData.contactPerson}
              name="contactPerson"
              placeholder="Enter contact person"
              maxLength={50}
              onChange={(value) =>
                setClientData({ ...clientData, contactPerson: value })
              }
            />
            <Input
              required
              disabled={formState === "display"}
              title="Contact Number"
              type="str"
              minLength={10}
              inputValue={clientData.contactNumber}
              name="contactNumber"
              placeholder="Enter contact number"
              maxLength={10}
              onChange={(value) =>
                setClientData({ ...clientData, contactNumber: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="Email"
              inputValue={clientData.email}
              name="email"
              placeholder="Enter email"
              onChange={(value) =>
                setClientData({ ...clientData, email: value })
              }
            />
            <TextArea
              disabled={formState === "display"}
              title="Address"
              inputValue={clientData.address}
              name="address"
              placeholder="Enter address"
              maxLength={300}
              onChange={(value) =>
                setClientData({ ...clientData, address: value })
              }
            />
            <Input
              disabled={formState === "display"}
              title="GST Number"
              type="str"
              inputValue={clientData.gstNumber}
              name="gstNumber"
              placeholder="Enter GST number"
              maxLength={15}
              onChange={(value) =>
                setClientData({ ...clientData, gstNumber: value })
              }
            />
          </section>
        </form>
      </div>
    </main>
  );
};

export default ClientEdit;
