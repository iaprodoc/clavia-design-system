import { CircleCheckIcon, LockIcon, MailIcon, TrashIcon, UsersIcon } from "@clavia-ds/icons";
import {
  Alert,
  AlertDialog,
  Avatar,
  Button,
  DataTable,
  Dialog,
  EmptyState,
  ErrorState,
  Field,
  Input,
  LoadingState,
  MetricCard,
  NativeSelect,
  PageHeader,
  Section,
  StatusBadge,
} from "@clavia-ds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import "./hub-people-access.css";

type AccessState = "success" | "loading" | "empty" | "error" | "unavailable" | "forbidden";

type Person = {
  email: string;
  id: string;
  name: string;
  projects: string;
  role: "Administradora" | "Cliente" | "Membro";
  status: "Ativo" | "Convite pendente";
};

const initialPeople: readonly Person[] = [
  {
    email: "marina.alves@exemplo.test",
    id: "marina",
    name: "Marina Alves",
    projects: "Clínica Horizonte · 2 projetos",
    role: "Administradora",
    status: "Ativo",
  },
  {
    email: "joana.nunes@exemplo.test",
    id: "joana",
    name: "Joana Nunes",
    projects: "Clínica Horizonte",
    role: "Cliente",
    status: "Convite pendente",
  },
  {
    email: "caio.rocha@exemplo.test",
    id: "caio",
    name: "Caio Rocha",
    projects: "Grupo Aurora · 3 projetos",
    role: "Membro",
    status: "Ativo",
  },
];

function PersonFormAction({ onSave }: { onSave: (person: Person) => void }) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Person["role"]>("Membro");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const validEmail = /^\S+@\S+\.\S+$/.test(email);
  const validName = name.trim().length >= 3;

  function close() {
    setSubmitAttempted(false);
    setIsOpen(false);
  }

  return (
    <Dialog
      actions={
        <>
          <Button onClick={close} variant="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setSubmitAttempted(true);
              if (!validName || !validEmail) return;
              onSave({
                email,
                id: email,
                name: name.trim(),
                projects: "Sem projeto demonstrativo",
                role,
                status: "Convite pendente",
              });
              close();
            }}
          >
            Salvar demonstração
          </Button>
        </>
      }
      description="O convite, a identidade, a autorização, os projetos e a entrega de e-mail continuam sob responsabilidade do Hub."
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Adicionar pessoa"
      trigger="Adicionar pessoa"
      triggerVariant="primary"
    >
      <div className="clv-hub-people-access__form">
        <Field
          id="person-name"
          label="Nome de demonstração"
          required
          {...(submitAttempted && !validName
            ? { error: "Informe pelo menos três caracteres." }
            : {})}
        >
          <Input onChange={(event) => setName(event.target.value)} value={name} />
        </Field>
        <Field
          id="person-email"
          label="E-mail fictício"
          required
          {...(submitAttempted && !validEmail
            ? { error: "Informe um e-mail fictício válido." }
            : {})}
        >
          <Input onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </Field>
        <label className="clv-hub-people-access__select-label" htmlFor="person-role">
          Papel exibido
          <NativeSelect
            id="person-role"
            onChange={(event) => setRole(event.target.value as Person["role"])}
            value={role}
          >
            <option value="Membro">Membro</option>
            <option value="Cliente">Cliente</option>
            <option value="Administradora">Administradora</option>
          </NativeSelect>
        </label>
      </div>
    </Dialog>
  );
}

function InviteDialog({
  isOpen,
  onComplete,
  onOpenChange,
  person,
}: {
  isOpen: boolean;
  onComplete: () => void;
  onOpenChange: (isOpen: boolean) => void;
  person: Person;
}) {
  function close() {
    onOpenChange(false);
  }

  return (
    <Dialog
      actions={
        <>
          <Button onClick={close} variant="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onComplete();
              close();
            }}
          >
            Reenviar demonstração
          </Button>
        </>
      }
      description={`A story não envia e-mail. No Hub, o reenvio para ${person.email} depende da identidade, do convite e da autorização.`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Reenviar convite para ${person.name}?`}
      trigger={`Reenviar convite para ${person.name}`}
      triggerHidden
    />
  );
}

function ResetAccessAction({
  isOpen,
  onComplete,
  onOpenChange,
  person,
}: {
  isOpen: boolean;
  onComplete: () => void;
  onOpenChange: (isOpen: boolean) => void;
  person: Person;
}) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const valid = password.length >= 8 && password === confirmPassword;

  function close() {
    setConfirmPassword("");
    setPassword("");
    setSubmitAttempted(false);
    onOpenChange(false);
  }

  return (
    <div className="clv-hub-people-access__reset-dialog">
      <Dialog
        actions={
          <>
            <Button onClick={close} variant="secondary">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setSubmitAttempted(true);
                if (!valid) return;
                onComplete();
                close();
              }}
            >
              Redefinir demonstração
            </Button>
          </>
        }
        description={`Uma redefinição real altera credenciais de ${person.name}. Esta demonstração usa somente estado local.`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={`Redefinir acesso de ${person.name}`}
        trigger={`Redefinir acesso de ${person.name}`}
        triggerHidden
      >
        <div className="clv-hub-people-access__form">
          <Field
            id={`new-password-${person.id}`}
            label="Senha temporária de demonstração"
            required
            {...(submitAttempted && password.length < 8
              ? { error: "Use pelo menos oito caracteres." }
              : {})}
          >
            <Input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </Field>
          <Field
            id={`confirm-password-${person.id}`}
            label="Confirmar senha"
            required
            {...(submitAttempted && password !== confirmPassword
              ? { error: "As senhas precisam coincidir." }
              : {})}
          >
            <Input
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              value={confirmPassword}
            />
          </Field>
        </div>
      </Dialog>
    </div>
  );
}

function DeactivateAction({
  isOpen,
  onDeactivate,
  onOpenChange,
  person,
}: {
  isOpen: boolean;
  onDeactivate: () => void;
  onOpenChange: (isOpen: boolean) => void;
  person: Person;
}) {
  function close() {
    onOpenChange(false);
  }

  return (
    <AlertDialog
      actions={
        <>
          <Button onClick={close} variant="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onDeactivate();
              close();
            }}
            variant="danger"
          >
            Desativar demonstração
          </Button>
        </>
      }
      description="No Hub, essa ação pode remover acesso e depende de regras para a própria pessoa e para a última administradora. Nenhuma alteração é persistida aqui."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Desativar ${person.name}?`}
      tone="danger"
      trigger={`Desativar ${person.name}`}
      triggerHidden
    />
  );
}

const personColumns = [
  {
    id: "person",
    isRowHeader: true,
    label: "Pessoa",
    render: (person: Person) => (
      <div className="clv-hub-people-access__person">
        <Avatar name={person.name} size="lg" />
        <div>
          <h3>{person.name}</h3>
          <p>{person.email}</p>
        </div>
      </div>
    ),
  },
  {
    id: "association",
    label: "Vínculo",
    render: (person: Person) => (
      <div className="clv-hub-people-access__metadata">
        <div className="clv-hub-people-access__association">
          <span>{person.projects}</span>
        </div>
        <div className="clv-hub-people-access__badges">
          <StatusBadge status={person.status === "Ativo" ? "success" : "warning"} variant="soft">
            {person.status}
          </StatusBadge>
          <StatusBadge
            status={person.role === "Administradora" ? "info" : "neutral"}
            variant="soft"
          >
            {person.role}
          </StatusBadge>
        </div>
      </div>
    ),
  },
] as const;

function HubPeopleAccess({ state = "success" }: { state?: AccessState }) {
  const [deactivatePerson, setDeactivatePerson] = useState<Person | null>(null);
  const [invitePerson, setInvitePerson] = useState<Person | null>(null);
  const [message, setMessage] = useState("");
  const [people, setPeople] = useState<Person[]>([...initialPeople]);
  const [resetPerson, setResetPerson] = useState<Person | null>(null);

  if (state === "loading") {
    return (
      <main className="clv-hub-people-access">
        <LoadingState
          description="As pessoas aparecerão quando a consulta do Hub terminar."
          label="Carregando pessoas"
        />
      </main>
    );
  }
  if (state === "empty") {
    return (
      <main className="clv-hub-people-access">
        <EmptyState
          action={<Button>Adicionar pessoa</Button>}
          description="Pessoas aparecem após convite, validação e autorização no Hub."
          title="Nenhuma pessoa disponível"
        />
      </main>
    );
  }
  if (state === "error") {
    return (
      <main className="clv-hub-people-access">
        <ErrorState
          action={<Button>Tentar novamente</Button>}
          description="A demonstração não recuperou as pessoas."
          title="As pessoas não foram carregadas"
        />
      </main>
    );
  }
  if (state === "unavailable") {
    return (
      <main className="clv-hub-people-access">
        <ErrorState
          action={<Button>Verificar conexão</Button>}
          description="A fonte de pessoas está temporariamente indisponível."
          title="Pessoas indisponíveis"
        />
      </main>
    );
  }
  if (state === "forbidden") {
    return (
      <main className="clv-hub-people-access">
        <ErrorState
          action={<Button>Voltar ao projeto</Button>}
          description="Sua permissão atual não permite consultar ou alterar pessoas."
          title="Sem permissão para pessoas"
        />
      </main>
    );
  }

  function addPerson(person: Person) {
    setPeople((current) => [...current, person]);
    setMessage(`${person.name} foi adicionado apenas nesta demonstração.`);
  }

  return (
    <main className="clv-hub-people-access">
      <PageHeader
        actions={<PersonFormAction onSave={addPerson} />}
        description="Consulte os vínculos e o estado de cada acesso. Identidade, autorização, convites e credenciais continuam no Hub."
        title="Pessoas, clientes e permissões"
        variant="plain"
      />

      <div className="clv-hub-people-access__priority">
        <Alert
          actions={
            <Button size="sm" variant="outline">
              Revisar no Hub
            </Button>
          }
          metadata={
            <>
              <StatusBadge status="warning" variant="soft">
                Convite pendente
              </StatusBadge>
              <StatusBadge leadingIcon={<UsersIcon />}>Joana Nunes</StatusBadge>
            </>
          }
          status="warning"
          title="Uma pessoa requer atenção"
          variant="featured"
        >
          Um convite demonstrativo está pendente de aceitação. Revise o acesso antes de continuar.
        </Alert>
      </div>

      <Section
        description="Contagens estáticas e locais; não há consulta de usuários ou permissões reais."
        title="Resumo de acessos"
      >
        <div className="clv-hub-people-access__metrics">
          <MetricCard
            description="Leitura local e demonstrativa."
            label="Pessoas exibidas"
            trend={
              <span className="clv-hub-people-access__metric-trend">
                <UsersIcon /> {people.length} perfis na lista
              </span>
            }
            value={people.length}
            valueFormat="two-digit"
          />
          <MetricCard
            description="Inclui equipe e clientes exibidos."
            label="Acessos ativos"
            tone="success"
            trend={
              <span className="clv-hub-people-access__metric-trend">
                <CircleCheckIcon /> Acesso ativo e textual
              </span>
            }
            value={people.filter((person) => person.status === "Ativo").length}
            valueFormat="two-digit"
          />
          <MetricCard
            description="Sem envio de e-mail nesta story."
            label="Convites pendentes"
            tone="warning"
            trend={
              <span className="clv-hub-people-access__metric-trend">
                <MailIcon /> Aguardando aceitação
              </span>
            }
            value={people.filter((person) => person.status === "Convite pendente").length}
            valueFormat="two-digit"
          />
        </div>
      </Section>

      <Section
        description="Papéis, vínculos e efeitos operacionais são demonstrados sem persistência. As ações contextuais ficam junto de cada pessoa."
        title="Pessoas do Hub"
      >
        <DataTable
          actionMenu={(person) => [
            ...(person.status === "Convite pendente"
              ? [
                  {
                    icon: <MailIcon />,
                    id: "resend-invite",
                    label: "Reenviar convite",
                    onAction: () => setInvitePerson(person),
                  },
                ]
              : []),
            {
              icon: <LockIcon />,
              id: "reset-access",
              label: "Redefinir acesso",
              onAction: () => setResetPerson(person),
            },
            {
              icon: <TrashIcon />,
              id: "deactivate-person",
              label: "Desativar pessoa",
              onAction: () => setDeactivatePerson(person),
            },
          ]}
          actionMenuLabel={(person) => `Mais ações para ${person.name}`}
          actionsVariant="overflow"
          columns={personColumns}
          getRowId={(person) => person.id}
          label="Pessoas do Hub"
          minWidth="58rem"
          rows={people}
        />
        {invitePerson ? (
          <InviteDialog
            isOpen
            onComplete={() =>
              setMessage(
                `O convite para ${invitePerson.name} foi reenviado apenas nesta demonstração.`,
              )
            }
            onOpenChange={(isOpen) => {
              if (!isOpen) setInvitePerson(null);
            }}
            person={invitePerson}
          />
        ) : null}
        {resetPerson ? (
          <ResetAccessAction
            isOpen
            onComplete={() =>
              setMessage(
                `O acesso de ${resetPerson.name} foi redefinido apenas nesta demonstração.`,
              )
            }
            onOpenChange={(isOpen) => {
              if (!isOpen) setResetPerson(null);
            }}
            person={resetPerson}
          />
        ) : null}
        {deactivatePerson ? (
          <DeactivateAction
            isOpen
            onDeactivate={() =>
              setMessage(`${deactivatePerson.name} seria desativado somente no Hub.`)
            }
            onOpenChange={(isOpen) => {
              if (!isOpen) setDeactivatePerson(null);
            }}
            person={deactivatePerson}
          />
        ) : null}
        {message ? (
          <p className="clv-hub-people-access__status" role="status">
            {message}
          </p>
        ) : null}
      </Section>

      <aside aria-label="Limite do contrato" className="clv-hub-people-access__boundary">
        Esta story não cria identidades, não atribui permissões, não envia convites, não muda senhas
        e não desativa pessoas.
      </aside>
    </main>
  );
}

const meta = {
  component: HubPeopleAccess,
  parameters: { layout: "fullscreen" },
  title: "Composições/Hub/Pessoas e acessos",
} satisfies Meta<typeof HubPeopleAccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sucesso: Story = {};

export const Interacoes: Story = {
  ...Sucesso,
  name: "Interações críticas",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const addTrigger = canvas.getByRole("button", { name: "Adicionar pessoa" });
    await userEvent.click(addTrigger);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog");
    const [name, email] = within(dialog).getAllByRole("textbox");
    if (!name || !email) throw new Error("Campos de pessoa não encontrados na demonstração.");
    await userEvent.click(within(dialog).getByRole("button", { name: "Salvar demonstração" }));
    await waitFor(() =>
      expect(within(dialog).getByText("Informe pelo menos três caracteres.")).toBeVisible(),
    );
    await userEvent.type(name, "Bruna Costa");
    await userEvent.type(email, "bruna.costa@exemplo.test");
    await userEvent.click(within(dialog).getByRole("button", { name: "Salvar demonstração" }));
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "adicionado apenas nesta demonstração",
    );

    const joanaMenuTrigger = canvas.getByRole("button", { name: "Mais ações para Joana Nunes" });
    await userEvent.click(joanaMenuTrigger);
    const joanaMenu = await within(canvasElement.ownerDocument.body).findByRole("menu", {
      name: "Mais ações para Joana Nunes",
    });
    await expect(joanaMenu.querySelectorAll(".clv-dropdown-menu__item-icon")).toHaveLength(3);
    await userEvent.click(within(joanaMenu).getByRole("menuitem", { name: "Reenviar convite" }));
    const inviteDialog = await within(canvasElement.ownerDocument.body).findByRole("dialog");
    await userEvent.click(
      within(inviteDialog).getByRole("button", { name: "Reenviar demonstração" }),
    );
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "reenviado apenas nesta demonstração",
    );

    const secondaryTrigger = canvas.getByRole("button", {
      name: "Mais ações para Marina Alves",
    });
    await userEvent.click(secondaryTrigger);
    const menu = await within(canvasElement.ownerDocument.body).findByRole("menu");
    await userEvent.click(within(menu).getByRole("menuitem", { name: "Redefinir acesso" }));
    const resetDialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", {
      name: "Redefinir acesso de Marina Alves",
    });
    await waitFor(() => expect(resetDialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(secondaryTrigger).toHaveFocus());

    const caioSecondaryTrigger = canvas.getByRole("button", {
      name: "Mais ações para Caio Rocha",
    });
    await userEvent.click(caioSecondaryTrigger);
    const caioMenu = await within(canvasElement.ownerDocument.body).findByRole("menu");
    await userEvent.click(within(caioMenu).getByRole("menuitem", { name: "Desativar pessoa" }));
    const confirmation = await within(canvasElement.ownerDocument.body).findByRole("alertdialog");
    await userEvent.click(within(confirmation).getByRole("button", { name: "Cancelar" }));
    await waitFor(() => expect(caioSecondaryTrigger).toHaveFocus());
  },
};

export const Carregando: Story = { args: { state: "loading" } };
export const Vazio: Story = { args: { state: "empty" } };
export const Falha: Story = { args: { state: "error" } };
export const Indisponivel: Story = { args: { state: "unavailable" } };
export const SemPermissao: Story = { args: { state: "forbidden" } };
