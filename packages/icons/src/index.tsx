import type {
  IconWeight,
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "@phosphor-icons/react";
import { ArchiveIcon as PhosphorArchiveIcon } from "@phosphor-icons/react/dist/ssr/Archive";
import { ArrowLeftIcon as PhosphorArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRightIcon as PhosphorArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowSquareOutIcon as PhosphorArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { ArrowsClockwiseIcon as PhosphorArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowsClockwise";
import { BellIcon as PhosphorBellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { BuildingsIcon as PhosphorBuildingsIcon } from "@phosphor-icons/react/dist/ssr/Buildings";
import { CalendarIcon as PhosphorCalendarIcon } from "@phosphor-icons/react/dist/ssr/Calendar";
import { CalendarCheckIcon as PhosphorCalendarCheckIcon } from "@phosphor-icons/react/dist/ssr/CalendarCheck";
import { CalendarDotsIcon as PhosphorCalendarDotsIcon } from "@phosphor-icons/react/dist/ssr/CalendarDots";
import { CaretDownIcon as PhosphorCaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretLeftIcon as PhosphorCaretLeftIcon } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRightIcon as PhosphorCaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { CaretUpIcon as PhosphorCaretUpIcon } from "@phosphor-icons/react/dist/ssr/CaretUp";
import { ChatCircleIcon as PhosphorChatCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle";
import { CheckIcon as PhosphorCheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { CheckCircleIcon as PhosphorCheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { ChecksIcon as PhosphorChecksIcon } from "@phosphor-icons/react/dist/ssr/Checks";
import { ClockIcon as PhosphorClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import { CopyIcon as PhosphorCopyIcon } from "@phosphor-icons/react/dist/ssr/Copy";
import { DeviceMobileIcon as PhosphorDeviceMobileIcon } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { DotsThreeIcon as PhosphorDotsThreeIcon } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { EnvelopeIcon as PhosphorEnvelopeIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { FileTextIcon as PhosphorFileTextIcon } from "@phosphor-icons/react/dist/ssr/FileText";
import { FloppyDiskIcon as PhosphorFloppyDiskIcon } from "@phosphor-icons/react/dist/ssr/FloppyDisk";
import { InfoIcon as PhosphorInfoIcon } from "@phosphor-icons/react/dist/ssr/Info";
import { LockIcon as PhosphorLockIcon } from "@phosphor-icons/react/dist/ssr/Lock";
import { MagicWandIcon as PhosphorMagicWandIcon } from "@phosphor-icons/react/dist/ssr/MagicWand";
import { MagnifyingGlassIcon as PhosphorMagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { PaperPlaneTiltIcon as PhosphorPaperPlaneTiltIcon } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { PencilIcon as PhosphorPencilIcon } from "@phosphor-icons/react/dist/ssr/Pencil";
import { PhoneIcon as PhosphorPhoneIcon } from "@phosphor-icons/react/dist/ssr/Phone";
import { PlusIcon as PhosphorPlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { QuestionIcon as PhosphorQuestionIcon } from "@phosphor-icons/react/dist/ssr/Question";
import { RobotIcon as PhosphorRobotIcon } from "@phosphor-icons/react/dist/ssr/Robot";
import { RocketLaunchIcon as PhosphorRocketLaunchIcon } from "@phosphor-icons/react/dist/ssr/RocketLaunch";
import { SidebarSimpleIcon as PhosphorSidebarSimpleIcon } from "@phosphor-icons/react/dist/ssr/SidebarSimple";
import { SignOutIcon as PhosphorSignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { SpinnerGapIcon as PhosphorSpinnerGapIcon } from "@phosphor-icons/react/dist/ssr/SpinnerGap";
import { SquaresFourIcon as PhosphorSquaresFourIcon } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { TargetIcon as PhosphorTargetIcon } from "@phosphor-icons/react/dist/ssr/Target";
import { TestTubeIcon as PhosphorTestTubeIcon } from "@phosphor-icons/react/dist/ssr/TestTube";
import { TrashIcon as PhosphorTrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { TrendUpIcon as PhosphorTrendUpIcon } from "@phosphor-icons/react/dist/ssr/TrendUp";
import { UploadSimpleIcon as PhosphorUploadSimpleIcon } from "@phosphor-icons/react/dist/ssr/UploadSimple";
import { UserIcon as PhosphorUserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { UsersIcon as PhosphorUsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { WarningIcon as PhosphorWarningIcon } from "@phosphor-icons/react/dist/ssr/Warning";
import { WarningCircleIcon as PhosphorWarningCircleIcon } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { WrenchIcon as PhosphorWrenchIcon } from "@phosphor-icons/react/dist/ssr/Wrench";
import { XIcon as PhosphorXIcon } from "@phosphor-icons/react/dist/ssr/X";
import { type ComponentType, useId } from "react";

export interface IconProps extends Omit<PhosphorIconProps, "alt" | "weight"> {
  title?: string;
}

interface IconRootProps extends IconProps {
  icon: PhosphorIcon;
}

const DEFAULT_ICON_WEIGHT: IconWeight = "bold";

function resolvePhosphorWeight(strokeWidth: IconProps["strokeWidth"]): IconWeight {
  const numericWidth =
    typeof strokeWidth === "number" ? strokeWidth : Number.parseFloat(String(strokeWidth));

  if (!Number.isFinite(numericWidth)) {
    return DEFAULT_ICON_WEIGHT;
  }

  if (numericWidth <= 1.25) {
    return "thin";
  }

  if (numericWidth < 1.8) {
    return "light";
  }

  if (numericWidth >= 2.4) {
    return "bold";
  }

  return "regular";
}

function IconRoot({
  icon: Icon,
  title,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  role,
  size = "1em",
  strokeWidth,
  ...props
}: IconRootProps) {
  const titleId = useId();
  const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);
  const weight = resolvePhosphorWeight(strokeWidth);

  return (
    <Icon
      {...props}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      aria-label={ariaLabel}
      aria-labelledby={title ? titleId : ariaLabelledBy}
      data-icon-source="phosphor"
      data-icon-weight={weight}
      focusable="false"
      role={role ?? (hasAccessibleName ? "img" : undefined)}
      size={size}
      weight={weight}
    >
      {title ? <title id={titleId}>{title}</title> : null}
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCheckIcon} {...props} />;
}

export function DoubleCheckIcon(props: IconProps) {
  return <IconRoot icon={PhosphorChecksIcon} {...props} />;
}

export function CircleAlertIcon(props: IconProps) {
  return <IconRoot icon={PhosphorWarningCircleIcon} {...props} />;
}

export function CircleCheckIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCheckCircleIcon} {...props} />;
}

export function InfoIcon(props: IconProps) {
  return <IconRoot icon={PhosphorInfoIcon} {...props} />;
}

export function QuestionIcon(props: IconProps) {
  return <IconRoot icon={PhosphorQuestionIcon} {...props} />;
}

export function TriangleAlertIcon(props: IconProps) {
  return <IconRoot icon={PhosphorWarningIcon} {...props} />;
}

export function ArchiveIcon(props: IconProps) {
  return <IconRoot icon={PhosphorArchiveIcon} {...props} />;
}

export function BellIcon(props: IconProps) {
  return <IconRoot icon={PhosphorBellIcon} {...props} />;
}

export function ArrowRightIcon(props: IconProps) {
  return <IconRoot icon={PhosphorArrowRightIcon} {...props} />;
}

export function ArrowLeftIcon(props: IconProps) {
  return <IconRoot icon={PhosphorArrowLeftIcon} {...props} />;
}

export function ChevronDownIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCaretDownIcon} {...props} />;
}

export function ChevronLeftIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCaretLeftIcon} {...props} />;
}

export function ChevronRightIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCaretRightIcon} {...props} />;
}

export function ChevronUpIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCaretUpIcon} {...props} />;
}

export function GridIcon(props: IconProps) {
  return <IconRoot icon={PhosphorSquaresFourIcon} {...props} />;
}

export function FileTextIcon(props: IconProps) {
  return <IconRoot icon={PhosphorFileTextIcon} {...props} />;
}

export function CalendarIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCalendarIcon} {...props} />;
}

export function ClockIcon(props: IconProps) {
  return <IconRoot icon={PhosphorClockIcon} {...props} />;
}

export function CopyIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCopyIcon} {...props} />;
}

export function ExternalLinkIcon(props: IconProps) {
  return <IconRoot icon={PhosphorArrowSquareOutIcon} {...props} />;
}

export function LockIcon(props: IconProps) {
  return <IconRoot icon={PhosphorLockIcon} {...props} />;
}

export function MailIcon(props: IconProps) {
  return <IconRoot icon={PhosphorEnvelopeIcon} {...props} />;
}

export function PhoneIcon(props: IconProps) {
  return <IconRoot icon={PhosphorPhoneIcon} {...props} />;
}

export function SmartphoneIcon(props: IconProps) {
  return <IconRoot icon={PhosphorDeviceMobileIcon} {...props} />;
}

export function DotsThreeIcon(props: IconProps) {
  return <IconRoot icon={PhosphorDotsThreeIcon} {...props} />;
}

export function BuildingIcon(props: IconProps) {
  return <IconRoot icon={PhosphorBuildingsIcon} {...props} />;
}

export function BotIcon(props: IconProps) {
  return <IconRoot icon={PhosphorRobotIcon} {...props} />;
}

export function TargetIcon(props: IconProps) {
  return <IconRoot icon={PhosphorTargetIcon} {...props} />;
}

export function TestTubeIcon(props: IconProps) {
  return <IconRoot icon={PhosphorTestTubeIcon} {...props} />;
}

export function CalendarClockIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCalendarDotsIcon} {...props} />;
}

export function CalendarSyncIcon(props: IconProps) {
  return <IconRoot icon={PhosphorCalendarCheckIcon} {...props} />;
}

export function MessageCircleIcon(props: IconProps) {
  return <IconRoot icon={PhosphorChatCircleIcon} {...props} />;
}

export function PencilIcon(props: IconProps) {
  return <IconRoot icon={PhosphorPencilIcon} {...props} />;
}

export function PlusIcon(props: IconProps) {
  return <IconRoot icon={PhosphorPlusIcon} {...props} />;
}

export function RefreshIcon(props: IconProps) {
  return <IconRoot icon={PhosphorArrowsClockwiseIcon} {...props} />;
}

export function RocketIcon(props: IconProps) {
  return <IconRoot icon={PhosphorRocketLaunchIcon} {...props} />;
}

export function SaveIcon(props: IconProps) {
  return <IconRoot icon={PhosphorFloppyDiskIcon} {...props} />;
}

export function SearchIcon(props: IconProps) {
  return <IconRoot icon={PhosphorMagnifyingGlassIcon} {...props} />;
}

export function SendIcon(props: IconProps) {
  return <IconRoot icon={PhosphorPaperPlaneTiltIcon} {...props} />;
}

export function XIcon(props: IconProps) {
  return <IconRoot icon={PhosphorXIcon} {...props} />;
}

export function LoaderIcon(props: IconProps) {
  return <IconRoot icon={PhosphorSpinnerGapIcon} {...props} />;
}

export function SignOutIcon(props: IconProps) {
  return <IconRoot icon={PhosphorSignOutIcon} {...props} />;
}

export function SidebarIcon(props: IconProps) {
  return <IconRoot icon={PhosphorSidebarSimpleIcon} {...props} />;
}

export function TrashIcon(props: IconProps) {
  return <IconRoot icon={PhosphorTrashIcon} {...props} />;
}

export function TrendingUpIcon(props: IconProps) {
  return <IconRoot icon={PhosphorTrendUpIcon} {...props} />;
}

export function UploadIcon(props: IconProps) {
  return <IconRoot icon={PhosphorUploadSimpleIcon} {...props} />;
}

export function UserIcon(props: IconProps) {
  return <IconRoot icon={PhosphorUserIcon} {...props} />;
}

export function WandIcon(props: IconProps) {
  return <IconRoot icon={PhosphorMagicWandIcon} {...props} />;
}

export function WrenchIcon(props: IconProps) {
  return <IconRoot icon={PhosphorWrenchIcon} {...props} />;
}

export function WhatsAppIcon({
  title,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  role,
  size = "1em",
  ...props
}: IconProps) {
  const titleId = useId();
  const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);

  return (
    <svg
      {...props}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      aria-label={ariaLabel}
      aria-labelledby={title ? titleId : ariaLabelledBy}
      fill="currentColor"
      focusable="false"
      height={size}
      role={role ?? (hasAccessibleName ? "img" : undefined)}
      viewBox="0 0 19 19"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16.1924 2.75914C14.4058 0.980934 12.0291 0.00101471 9.49956 0C6.97573 0 4.59525 0.97905 2.79691 2.75682C0.995372 4.53764 0.00232157 6.90423 0 9.41201V9.41665C0.000290196 10.9345 0.399455 12.4657 1.15716 13.8634L0.0259725 19L5.22672 17.8182C6.54392 18.4813 8.01362 18.831 9.49594 18.8316H9.49971C12.0231 18.8316 14.4036 17.8524 16.2022 16.0744C18.0054 14.2922 18.9988 11.9286 19 9.41926C19.0007 6.92757 18.0038 4.56228 16.1924 2.75914ZM9.49956 17.3486H9.49623C8.16524 17.3481 6.84645 17.0142 5.68262 16.3829L5.43668 16.2496L1.97841 17.0354L2.72958 13.6248L2.58478 13.3753C1.8648 12.1349 1.48435 10.7656 1.48435 9.41505C1.48711 5.04354 5.08235 1.48293 9.49927 1.48293C11.6331 1.4838 13.638 2.3102 15.1447 3.80965C16.6742 5.3323 17.5162 7.32432 17.5155 9.41882C17.5138 13.7914 13.9178 17.3486 9.49956 17.3486Z" />
      <path d="M6.91464 5.26446H6.49821C6.35326 5.26446 6.11791 5.31867 5.91884 5.53509C5.71962 5.75166 5.15823 6.27511 5.15823 7.33968C5.15823 8.40426 5.93697 9.43288 6.04551 9.57741C6.15419 9.72179 7.54872 11.9762 9.7574 12.8435C11.593 13.5642 11.9667 13.4208 12.365 13.3847C12.7634 13.3488 13.6507 12.8614 13.8318 12.3563C14.0128 11.8511 14.0128 11.4179 13.9586 11.3275C13.9042 11.2373 13.7592 11.1833 13.542 11.0751C13.3246 10.9668 12.2596 10.4345 12.0604 10.3622C11.8612 10.2902 11.7164 10.2541 11.5714 10.4708C11.4265 10.6871 10.9997 11.1875 10.8729 11.3318C10.7462 11.4764 10.6194 11.4945 10.4021 11.3862C10.1847 11.2776 9.49202 11.0451 8.66191 10.3081C8.01579 9.73454 7.56744 9.00308 7.44062 8.78651C7.31395 8.57009 7.42713 8.45296 7.5361 8.34497C7.63375 8.24814 7.76564 8.11565 7.87432 7.98939C7.98286 7.86298 8.01376 7.77282 8.08631 7.62844C8.15871 7.48406 8.12244 7.35766 8.06817 7.24952C8.01376 7.14123 7.59675 6.0713 7.40348 5.64338C7.24068 5.28301 7.06946 5.27084 6.91464 5.26446Z" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return <IconRoot icon={PhosphorUsersIcon} {...props} />;
}

export type IconCategory =
  | "Ação"
  | "Ajuda"
  | "Canal"
  | "Domínio"
  | "Navegação"
  | "Objeto"
  | "Status";

export interface IconCatalogEntry {
  category: IconCategory;
  component: ComponentType<IconProps>;
  intent: string;
  name: string;
  source: "Clavia" | "Phosphor";
}

export const iconCatalog = [
  {
    category: "Ação",
    component: ArchiveIcon,
    intent: "Arquivar ou retirar da lista ativa",
    name: "ArchiveIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: BellIcon,
    intent: "Notificações e atualizações da conta",
    name: "BellIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ArrowLeftIcon,
    intent: "Voltar a uma etapa ou página anterior",
    name: "ArrowLeftIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ArrowRightIcon,
    intent: "Avançar ou indicar direção",
    name: "ArrowRightIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: BotIcon,
    intent: "Configuração ou recurso de IA",
    name: "BotIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: BuildingIcon,
    intent: "Clínica ou organização",
    name: "BuildingIcon",
    source: "Phosphor",
  },
  {
    category: "Objeto",
    component: CalendarIcon,
    intent: "Data, agenda ou calendário",
    name: "CalendarIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: CalendarClockIcon,
    intent: "Briefing ou agenda futura",
    name: "CalendarClockIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: CalendarSyncIcon,
    intent: "Agenda compartilhada ou sincronização",
    name: "CalendarSyncIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: CheckIcon,
    intent: "Confirmação ou seleção",
    name: "CheckIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: DoubleCheckIcon,
    intent: "Marcar um conjunto como lido ou concluído",
    name: "DoubleCheckIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ChevronDownIcon,
    intent: "Expandir ou abrir seleção",
    name: "ChevronDownIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ChevronLeftIcon,
    intent: "Navegação curta para a esquerda",
    name: "ChevronLeftIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ChevronRightIcon,
    intent: "Navegação contextual ou detalhe",
    name: "ChevronRightIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ChevronUpIcon,
    intent: "Recolher ou navegar para cima",
    name: "ChevronUpIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: CircleAlertIcon,
    intent: "Erro ou perigo persistente",
    name: "CircleAlertIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: CircleCheckIcon,
    intent: "Sucesso persistente",
    name: "CircleCheckIcon",
    source: "Phosphor",
  },
  {
    category: "Objeto",
    component: ClockIcon,
    intent: "Horário, duração ou histórico recente",
    name: "ClockIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: DotsThreeIcon,
    intent: "Abrir opções secundárias",
    name: "DotsThreeIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: CopyIcon,
    intent: "Copiar conteúdo",
    name: "CopyIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: ExternalLinkIcon,
    intent: "Abrir destino externo",
    name: "ExternalLinkIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: SignOutIcon,
    intent: "Encerrar a sessão atual",
    name: "SignOutIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: SidebarIcon,
    intent: "Recolher ou expandir a navegação lateral",
    name: "SidebarIcon",
    source: "Phosphor",
  },
  {
    category: "Objeto",
    component: FileTextIcon,
    intent: "Documento ou formulário",
    name: "FileTextIcon",
    source: "Phosphor",
  },
  {
    category: "Objeto",
    component: UserIcon,
    intent: "Perfil ou conta de uma pessoa",
    name: "UserIcon",
    source: "Phosphor",
  },
  {
    category: "Navegação",
    component: GridIcon,
    intent: "Visão geral ou grade de itens",
    name: "GridIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: InfoIcon,
    intent: "Informação contextual",
    name: "InfoIcon",
    source: "Phosphor",
  },
  {
    category: "Ajuda",
    component: QuestionIcon,
    intent: "Abrir uma explicação complementar",
    name: "QuestionIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: LoaderIcon,
    intent: "Processamento em andamento",
    name: "LoaderIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: LockIcon,
    intent: "Recurso bloqueado ou protegido",
    name: "LockIcon",
    source: "Phosphor",
  },
  {
    category: "Canal",
    component: MailIcon,
    intent: "Canal de e-mail",
    name: "MailIcon",
    source: "Phosphor",
  },
  {
    category: "Canal",
    component: MessageCircleIcon,
    intent: "Conversa genérica",
    name: "MessageCircleIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: PencilIcon,
    intent: "Editar item",
    name: "PencilIcon",
    source: "Phosphor",
  },
  {
    category: "Canal",
    component: PhoneIcon,
    intent: "Ligação ou contato telefônico",
    name: "PhoneIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: PlusIcon,
    intent: "Adicionar ou criar item",
    name: "PlusIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: RefreshIcon,
    intent: "Atualizar ou tentar novamente",
    name: "RefreshIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: RocketIcon,
    intent: "Publicar, implantar ou iniciar",
    name: "RocketIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: SaveIcon,
    intent: "Salvar alterações",
    name: "SaveIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: SearchIcon,
    intent: "Pesquisar conteúdo",
    name: "SearchIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: SendIcon,
    intent: "Enviar conteúdo ou mensagem",
    name: "SendIcon",
    source: "Phosphor",
  },
  {
    category: "Canal",
    component: SmartphoneIcon,
    intent: "Dispositivo ou canal móvel",
    name: "SmartphoneIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: TargetIcon,
    intent: "Meta ou processo comercial",
    name: "TargetIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: TestTubeIcon,
    intent: "Teste ou experimento",
    name: "TestTubeIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: TrashIcon,
    intent: "Excluir item",
    name: "TrashIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: TrendingUpIcon,
    intent: "Tendência positiva",
    name: "TrendingUpIcon",
    source: "Phosphor",
  },
  {
    category: "Status",
    component: TriangleAlertIcon,
    intent: "Atenção ou aviso",
    name: "TriangleAlertIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: UploadIcon,
    intent: "Enviar arquivo",
    name: "UploadIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: UsersIcon,
    intent: "Equipe ou CRM",
    name: "UsersIcon",
    source: "Phosphor",
  },
  {
    category: "Domínio",
    component: WandIcon,
    intent: "Gerar ou transformar com assistência",
    name: "WandIcon",
    source: "Phosphor",
  },
  {
    category: "Canal",
    component: WhatsAppIcon,
    intent: "Canal WhatsApp",
    name: "WhatsAppIcon",
    source: "Clavia",
  },
  {
    category: "Domínio",
    component: WrenchIcon,
    intent: "Ferramenta ou manutenção",
    name: "WrenchIcon",
    source: "Phosphor",
  },
  {
    category: "Ação",
    component: XIcon,
    intent: "Fechar ou remover item",
    name: "XIcon",
    source: "Phosphor",
  },
] as const satisfies readonly IconCatalogEntry[];
