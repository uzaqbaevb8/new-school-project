import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Card,
  Container,
  Stack,
  Text,
  Group,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { api } from "../../api/api"; // ← sizdagi API path'ga qarab moslashtiring
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        phone,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        notifications.show({
          title: "Success",
          message: "Ro'yxatdan o'tdingiz! Endi login qilishingiz mumkin.",
          color: "teal",
          icon: <Check />,
        });
        navigate("/login");
      } else {
        notifications.show({
          title: "Xatolik",
          message: "Ro'yxatdan o'tishda muammo!",
          color: "red",
          icon: <X />,
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      notifications.show({
        title: "Xatolik",
        message: error.response?.data?.message || "Serverda xatolik yuz berdi",
        color: "red",
        icon: <X />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={400}>
      <Card w={300} m="50% auto" p={15} shadow="sm">
        <Stack>
          <Text ta="center" fw={500} size="lg">
            Ro'yxatdan o'tish
          </Text>
          <TextInput
            type="number"
            label="Telefon raqam"
            placeholder="998901234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <PasswordInput
            label="Parol"
            placeholder="Yangi parolingiz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group gap={5}>
            <Button fullWidth onClick={handleRegister} disabled={loading}>
              {loading ? <Loader size="xs" /> : "Ro'yxatdan o'tish"}
            </Button>
            <Button fullWidth variant="subtle" onClick={() => navigate("/login")}>
              Login sahifasiga qaytish
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
};

export default Register;
