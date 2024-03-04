import {
  Button,
  Flex,
  Group,
  Text,
  NumberInput,
  Loader,
  Paper,
  LoadingOverlay,
  // Image,
  // Avatar,
} from "@mantine/core";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconCoins, IconSend } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import Swal from "sweetalert2";

export default function GuestProject({ projectId }: { projectId: number }) {
  const [guestData, setGuestData] = useState<GuestType>({
    profile_pic: "",
    last_name_en: "",
    first_name_en: "",
    virtual_money: 0,
    id: 0,
  });
  const [alreadyGivenVirtualMoney, setAlreadyGivenVirtualMoney] = useState({
    amount: 0,
  });
  const [isGivenLoading, setIsGivenLoading] = useState(true);
  const [isGuestDataLoading, setIsGuestDataLoading] = useState(true);
  const [isGiveVirtualMoneyLoading, setIsGiveVirtualMoneyLoading] =
    useState(false);
  const [giveVirtualMoneyError, setGiveVirtualMoneyError] = useState("");
  const [unit, setUnit] = useState("");

  const navigate = useNavigate();
  const { eventId } = useParams();

  const form = useForm({
    initialValues: {
      amount: Number(0),
    },

    validate: {
      amount: (value) =>
        value <= 0
          ? "Amount must be greater than 0"
          : value > guestData?.virtual_money
          ? "Amount must be less than your virtual money"
          : null,
    },
  });

  useEffect(() => {
    const fetchAlreadyGive = () => {
      axios
        .get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }guests/get-already-given-virtual-money?projectId=${projectId}&guestId=${
            guestData.id
          }&eventId=${eventId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            setAlreadyGivenVirtualMoney(res.data.data);
            setIsGivenLoading(false);
          }
          setIsGivenLoading(false);
        })
        .catch((error) => {
          console.error("Error during fetchAlreadyGiven:", error);
          setIsGivenLoading(false);
          // Handle error gracefully, show a message to the user, or retry
        });
    };
    fetchAlreadyGive();

    const fetchEventData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            withCredentials: true,
          }
        );
        setUnit(res.data.data.unit_money);
      } catch (err) {
        // console.error("Error fetching event data:", err);
      }
    };
    fetchEventData();
  }, [eventId, guestData.id, projectId]);

  const fetchAlreadyGive = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/get-already-given-virtual-money?projectId=${projectId}&guestId=${
          guestData.id
        }&eventId=${eventId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          setAlreadyGivenVirtualMoney(res.data.data);
        }
      })
      .catch(() => {
        // console.error("Error during fetchAlreadyGiven:", error);
      });
  };

  const fetchGuestData = useCallback(async () => {
    await axios
      .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/get-guest-data`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success === true) {
          console.log("guest data", res.data.data);
          setGuestData(res.data.data);
          setIsGuestDataLoading(false);
        }
        setIsGuestDataLoading(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/isLoggedIn`,
          {
            withCredentials: true,
          }
        );
        if (response.data.authenticated === false) {
          console.log("not authenticated");
          window.location.href = `${
            import.meta.env.VITE_FRONTEND_ENDPOINT
          }/guest/login`;
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    isLoggedIn();

    fetchGuestData();
  }, [fetchGuestData, navigate, projectId]);

  async function giveVirtualMoney() {
    setIsGiveVirtualMoneyLoading(true);
    await axios
      .post(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/give-virtual-money?projectId=${projectId}&guestId=${
          guestData?.id
        }&eventId=${eventId}`,
        {
          amount: form.values.amount,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          // Swal.fire({
          //   icon: "success",
          //   title: "Success",
          //   text: `Virtual money given ${form.values.amount}`,
          //   timer: 1000,
          //   showConfirmButton: false,
          // });
          close();
          //   setIsLoading(false);
          fetchGuestData();
          fetchAlreadyGive();
          setIsGiveVirtualMoneyLoading(false);
          form.reset();
        } else {
          //   setIsLoading(false);
          setGiveVirtualMoneyError(res.data.message);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          close();
        }
      })
      .catch(() => {});
  }

  type GuestType = {
    profile_pic: string;
    last_name_en: string;
    first_name_en: string;
    virtual_money: number;
    id: number;
  };

  return (
    <>
      <Paper withBorder p="md" radius="md" bg="none" h="max-content">
        {isGivenLoading ? (
          <LoadingOverlay
            visible={isGivenLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "greencolor.4", type: "dots" }}
          />
        ) : (
          <>
            <Group justify="space-between">
              <Text c="graycolor.2">You have</Text>
              <IconCoins size={16} />
            </Group>

            <Flex justify="space-between" align="baseline" gap="xs">
              <Flex align="baseline" gap="xs">
                <Text fz="50" fw={500} c="greencolor.4">
                  {isGuestDataLoading ? (
                    <Loader color="greencolor.4" size={14} />
                  ) : (
                    guestData.virtual_money.toLocaleString()
                  )}
                </Text>
                <Text c="greencolor.3" fz="md">
                  {unit}
                </Text>
              </Flex>
            </Flex>
            <Flex justify="flex-end" align="center" gap="xs">
              <Text fz="md" c="dimmed">
                {isGivenLoading ? (
                  <>
                    <Flex align="center" gap="xs">
                      <Loader color="greencolor.4" size={14} />
                    </Flex>
                  </>
                ) : (
                  <>{alreadyGivenVirtualMoney.amount.toLocaleString()} given</>
                )}{" "}
              </Text>
            </Flex>
          </>
        )}
      </Paper>
      <form onSubmit={form.onSubmit(() => giveVirtualMoney())}>
        <Text size="md" c="greencolor.4" mt="md">
          Give Virtual Money
        </Text>
        <Flex
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <NumberInput
            // label="Virtual Money"
            placeholder="Enter amount"
            defaultValue={0}
            thousandSeparator=","
            {...form.getInputProps("amount")}
          />
          {giveVirtualMoneyError && (
            <Text c="red" size="sm">
              {giveVirtualMoneyError}
            </Text>
          )}

          <Button type="submit" color="greencolor.4">
            {isGiveVirtualMoneyLoading ? (
              <Loader type="dots" color="white" size={20} />
            ) : (
              <IconSend size={14} />
            )}
          </Button>
        </Flex>
      </form>
    </>
  );
}
