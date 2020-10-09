import styled, { css } from 'styled-components/native';
import ListItem from '../../../components/list-item/ListItem';
import { darken } from 'polished';

type ListItemStylesProps = {
  selected: boolean;
};

export const ListItemStyled = styled(ListItem)<ListItemStylesProps>`
  ${props =>
    props.selected &&
    css`
      background-color: ${props.theme.primaryLight};
      border-bottom-color: ${darken(0.36, props.theme.primaryLight)};
    `}
`;
